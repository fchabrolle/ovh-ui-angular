import merge from "lodash/merge";

export default class {
    constructor () {
        this.translations = {
            errors: {
                required: "Mandatory.",
                number: "Invalid number.",
                email: "Invalid email.",
                min: "Too low ({{min}} min).",
                max: "Too high ({{max}} max).",
                minlength: "Too short ({{minlength}} characters min).",
                maxlength: "Too high ({{maxlength}} characters max).",
                pattern: "Invalid format."
            }
        };
    }

    /**
     * Set the translations for the field component
     * @param {Object} translations a map of translations
     */
    setTranslations (translations) {
        this.translations = merge(this.translations, translations);
        return this;
    }

    $get () {
        return {
            translations: this.translations
        };
    }
}
