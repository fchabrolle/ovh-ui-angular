import { getAttribute, hasAttributeValue } from "@oui-angular/common/component-utils";

const LABEL_SELECTOR = ".oui-field__label";
const CUSTOM_ELEMENT_CLASS = "oui-field__component";

const CONTROLS_SELECTORS = [
    "input",
    "select",
    "textarea",

    // Class set on custom components only.
    `.${CUSTOM_ELEMENT_CLASS}`
];

const ERROR_CLASSES = {
    input: "oui-input_error",
    select: "oui-select_error",
    textarea: "oui-textarea_error"
};

const VALIDATION_PARAMETERS = {
    min: ["min", "ng-min"],
    max: ["max", "ng-max"],
    minlength: ["minlength", "ng-minlength"],
    maxlength: ["maxlength", "ng-maxlength"],
    pattern: ["pattern", "ng-pattern"]
};

export default class FieldController {
    constructor ($element, $scope, $timeout, ouiFieldConfiguration) {
        "ngInject";

        this.$element = $element;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.ouiFieldConfiguration = ouiFieldConfiguration;
    }

    $onInit () {
        this.controlElements = [];
        this.controls = {};
        this.currentErrorField = null;
        this.ids = [];
        this.validationParameters = {};
        this.isErrorVisible = false;
    }

    $postLink () {
        // Since digest is already done and DOM is not written,
        // we need to wait for next digest to get `name` and `id` attribute.
        this.$timeout(() => {
            // Get all controls in the field.
            this.controls = this.getAllControls();

            if (!this.controlElements.length) {
                throw new Error("oui-field component requires at least one form control.");
            }

            if (!Object.keys(this.controls).length) {
                throw new Error("oui-field component requires a form control with a name.");
            }

            // The id is taken from the first control found
            // to create the `for` attribute on the label.
            // If the control is a checkbox or a radio, we skip this part
            // because we don't want to link the field label to the first checkbox/radio.
            if (this.ids.length === 1 && this.controlElements.length === 1) {
                this.for = this.ids[0];
            }

            this.$ouiFieldElement = angular.element(this.$element[0].querySelector(".oui-field"));

            Object.keys(this.controls).forEach(name => {
                const namedControls = this.controls[name];

                // TODO: Skip radio for now (there is no validation for them)
                if (namedControls.length > 1) {
                    return;
                }

                // Manage the way the error are shown on the field.
                namedControls.forEach(control => {
                    // Avoid binding DOM events
                    if (angular.element(control).hasClass(CUSTOM_ELEMENT_CLASS)) {
                        return;
                    }
                    this.bindDOMEvents(control, name);
                });

                // Retrieve all validation parameters by field name.
                this.validationParameters[name] = FieldController.getValidationParameters(this.controls[name][0]);
            });

            // Handle click on label to set focus on form element.
            this.label = angular.element(this.$element[0].querySelector(LABEL_SELECTOR));
            this.label.on("click", () => {
                this.$scope.$broadcast("oui:focus");
            });
        });
    }

    $destroy () {
        Object.keys(this.controls).forEach(name => {
            const namedControls = this.controls[name];
            namedControls.forEach(control => {
                angular.element(control).off("blur");
                angular.element(control).off("focus");
            });
        });

        if (this.label) {
            this.label.off("click");
        }
    }

    bindDOMEvents (controlElement, name) {
        angular.element(controlElement).on("blur", () => {
            this.showErrors(controlElement, name);
        });

        angular.element(controlElement).on("focus", () => {
            this.hideErrors(controlElement, name);
        });
    }

    showErrors (controlElement, name) {
        this.$timeout(() => {
            if (this.form[name] && this.form[name].$invalid) {
                angular.element(controlElement).addClass(FieldController.getErrorClass(controlElement));
                this.$ouiFieldElement.addClass("oui-field_error");
                this.isErrorVisible = true;
                this.currentErrorField = name;
            } else {
                angular.element(controlElement).removeClass(FieldController.getErrorClass(controlElement));
                this.$ouiFieldElement.removeClass("oui-field_error");
                this.isErrorVisible = false;
            }
        });
    }

    hideErrors (controlElement, name) {
        this.$timeout(() => {
            this.form[name].$touched = false;
            this.isErrorVisible = false;
            angular.element(controlElement).removeClass(FieldController.getErrorClass(controlElement));
            this.$ouiFieldElement.removeClass("oui-field_error");
        });
    }

    getFirstError () {
        const names = Object.keys(this.controls);
        for (let i = 0; i < names.length; ++i) {
            if (this.form[names[i]] && this.form[names[i]].$invalid) {
                return this.form[names[i]].$error;
            }
        }

        return null;
    }

    getMessageString (errorName) {
        return (this.errorMessages && this.errorMessages[errorName]) || this.ouiFieldConfiguration.translations.errors[errorName];
    }

    getErrorMessage (errorName) {
        const message = this.getMessageString(errorName);
        const parameterValue = this.validationParameters[this.currentErrorField][errorName];
        return message.replace(`{{${errorName}}}`, parameterValue);
    }

    getAllControls () {
        const controlsSelector = CONTROLS_SELECTORS.join(",");
        this.controlElements = Array.from(this.$element[0].querySelectorAll(controlsSelector));
        return this.controlElements

            // Exclude all controls that have no defined name attribute.
            .filter(control => hasAttributeValue(control, "name"))
            .map(control => {
                // Get all ids available on controls
                if (hasAttributeValue(control, "id")) {
                    this.ids.push(getAttribute(control, "id"));
                }

                return getAttribute(control, "name");
            })
            .reduce((controls, name) => {
                controls[name] = Array.from(this.$element[0].querySelectorAll(`[name="${name}"]`));
                return controls;
            }, {});
    }

    static getErrorClass (controlElement) {
        const tagName = controlElement.tagName.toLowerCase();
        return ERROR_CLASSES[tagName];
    }

    static getValidationParameters (controlElement) {
        const validationParameters = {};
        Object.keys(VALIDATION_PARAMETERS).forEach(validationName => {
            const attributes = VALIDATION_PARAMETERS[validationName];
            attributes.forEach(attributeName => {
                if (hasAttributeValue(controlElement, attributeName)) {
                    validationParameters[validationName] = getAttribute(controlElement, attributeName);
                }
            });
        });
        return validationParameters;
    }
}
