import { addBooleanParameter, addDefaultParameter } from "@oui-angular/common/component-utils";
export default class {
    constructor ($q, $element, $attrs, ouiDualListProvider) {
        "ngInject";

        this.$q = $q;
        this.$element = $element;
        this.$attrs = $attrs;
        this.dualListProvider = ouiDualListProvider;
    }

    $onInit () {
        addDefaultParameter(this, "sourceListLabel", this.dualListProvider.translations.sourceListLabel);
        addDefaultParameter(this, "targetListLabel", this.dualListProvider.translations.targetListLabel);
        addDefaultParameter(this, "moveAllLabel", this.dualListProvider.translations.moveAllLabel);
        addDefaultParameter(this, "removeAllLabel", this.dualListProvider.translations.removeAllLabel);
        addDefaultParameter(this, "addLabel", this.dualListProvider.translations.addLabel);
        addDefaultParameter(this, "sourceListEmptyLabel", this.dualListProvider.translations.sourceListEmptyLabel);
        addDefaultParameter(this, "targetListEmptyLabel", this.dualListProvider.translations.targetListEmptyLabel);
        addDefaultParameter(this, "property", null);
        addBooleanParameter(this, "bulkActionEnabled");

        this.sourceList = this.sourceList || [];
        this.targetList = this.targetList || [];
        this.onAdd = this.onAdd || null;
        this.onRemove = this.onRemove || null;

        this.loadingMap = {};
        this.sourceListLoading = false;
        this.targetListLoading = false;
        this.loadSourceList();
        this.loadTargetList();
    }

    $postLink () {
        this.$element.addClass("oui-dual-list");
        this.sourceCloseIcon = this.$element[0].querySelector(".oui-dual-list__source > .oui-dual-list__header > .oui-dual-list__header_toggle > .oui-dual-list__header_toggle_up");
        this.sourceOpenIcon = this.$element[0].querySelector(".oui-dual-list__source > .oui-dual-list__header > .oui-dual-list__header_toggle > .oui-dual-list__header_toggle_down");
        this.sourceContent = this.$element[0].querySelector(".oui-dual-list__source > .oui-dual-list__content");
        this.targetCloseIcon = this.$element[0].querySelector(".oui-dual-list__target > .oui-dual-list__header > .oui-dual-list__header_toggle > .oui-dual-list__header_toggle_up");
        this.targetOpenIcon = this.$element[0].querySelector(".oui-dual-list__target > .oui-dual-list__header > .oui-dual-list__header_toggle > .oui-dual-list__header_toggle_down");
        this.targetContent = this.$element[0].querySelector(".oui-dual-list__target > .oui-dual-list__content");

        angular.element(this.sourceCloseIcon).addClass("oui-dual-list__display-inline-block");
        angular.element(this.sourceOpenIcon).addClass("oui-dual-list__display-none");
        angular.element(this.sourceContent).addClass("oui-dual-list__display-flex");
        angular.element(this.targetCloseIcon).addClass("oui-dual-list__display-none");
        angular.element(this.targetOpenIcon).addClass("oui-dual-list__display-inline-block");
        angular.element(this.targetContent).addClass("oui-dual-list__display-none");
    }

    onTargetContentClose () {
        angular.element(this.targetCloseIcon).removeClass("oui-dual-list__display-inline-block");
        angular.element(this.targetCloseIcon).addClass("oui-dual-list__display-none");
        angular.element(this.targetOpenIcon).removeClass("oui-dual-list__display-none");
        angular.element(this.targetOpenIcon).addClass("oui-dual-list__display-inline-block");
        angular.element(this.targetContent).removeClass("oui-dual-list__display-flex");
        angular.element(this.targetContent).addClass("oui-dual-list__display-none");
    }

    onTargetContentOpen () {
        angular.element(this.targetCloseIcon).removeClass("oui-dual-list__display-none");
        angular.element(this.targetCloseIcon).addClass("oui-dual-list__display-inline-block");
        angular.element(this.targetOpenIcon).removeClass("oui-dual-list__display-inline-block");
        angular.element(this.targetOpenIcon).addClass("oui-dual-list__display-none");
        angular.element(this.targetContent).removeClass("oui-dual-list__display-none");
        angular.element(this.targetContent).addClass("oui-dual-list__display-flex");
    }

    onSourceContentClose () {
        angular.element(this.sourceCloseIcon).removeClass("oui-dual-list__display-inline-block");
        angular.element(this.sourceCloseIcon).addClass("oui-dual-list__display-none");
        angular.element(this.sourceOpenIcon).removeClass("oui-dual-list__display-none");
        angular.element(this.sourceOpenIcon).addClass("oui-dual-list__display-inline-block");
        angular.element(this.sourceContent).removeClass("oui-dual-list__display-flex");
        angular.element(this.sourceContent).addClass("oui-dual-list__display-none");
    }

    onSourceContentOpen () {
        angular.element(this.sourceCloseIcon).removeClass("oui-dual-list__display-none");
        angular.element(this.sourceCloseIcon).addClass("oui-dual-list__display-inline-block");
        angular.element(this.sourceOpenIcon).removeClass("oui-dual-list__display-inline-block");
        angular.element(this.sourceOpenIcon).addClass("oui-dual-list__display-none");
        angular.element(this.sourceContent).removeClass("oui-dual-list__display-none");
        angular.element(this.sourceContent).addClass("oui-dual-list__display-flex");
    }

    getProperty (item) {
        if (!this.property) {
            return item;
        }
        return this.property.split(".").reduce((prev, curr) => prev ? prev[curr] : undefined, item);
    }

    isLoading (item) {
        const uniqueName = this.getProperty(item);
        return this.loadingMap[uniqueName];
    }

    setLoading (item, state) {
        const uniqueName = this.getProperty(item);
        this.loadingMap[uniqueName] = state;
    }

    loadSourceList () {
        if (this.sourceListLoading) {
            return this.$q.reject(false);
        }
        this.sourceListLoading = true;
        return this.$q.when(this.sourceList)
            .then(items => {
                this.sourceList = items.data ? items.data : items;
            })
            .finally(() => {
                this.sourceListLoading = false;
            });
    }

    loadTargetList () {
        if (this.targetListLoading) {
            return this.$q.reject(false);
        }
        this.targetListLoading = true;
        return this.$q.when(this.targetList)
            .then(items => {
                this.targetList = items.data ? items.data : items;
            })
            .finally(() => {
                this.targetListLoading = false;
            });
    }

    add (index, item) {
        if (this.isLoading(item)) {
            return;
        }
        this.sourceList.splice(index, 1);
        this.targetList.push(item);
        if (this.onAdd) {
            this.setLoading(item, true);
            this.onAdd({ items: [item] })
                .catch(() => {
                    const newIndex = this.targetList.indexOf(item);
                    this.targetList.splice(newIndex, 1);
                    this.sourceList.push(item);
                })
                .finally(() => this.setLoading(item, false));
        }
    }

    remove (index, item) {
        if (this.isLoading(item)) {
            return;
        }
        this.targetList.splice(index, 1);
        this.sourceList.push(item);
        if (this.onRemove) {
            this.setLoading(item, true);
            this.onRemove({ items: [item] })
                .catch(() => {
                    const newIndex = this.sourceList.indexOf(item);
                    this.sourceList.splice(newIndex, 1);
                    this.targetList.push(item);
                })
                .finally(() => this.setLoading(item, false));
        }
    }

    addAll () {
        const list = this.sourceList.filter(item => !this.isLoading(item));
        if (list.length === 0) {
            return;
        }
        list.forEach(item => {
            // move to target list and set loading
            this.targetList.push(item);
            this.setLoading(item, true);

            // remove from source list
            const newIndex = this.sourceList.indexOf(item);
            this.sourceList.splice(newIndex, 1);
        });
        if (this.onAdd) {
            this.onAdd({ items: list })
                .then(() => {
                    // all items successfully moved, remove loading
                    list.forEach(item => this.setLoading(item, false));
                }).catch(failedItems => {
                    // some or all items failed to move
                    failedItems.forEach(item => {
                        // move back to source list and remove loading
                        this.sourceList.push(item);
                        this.setLoading(item, false);

                        // remove from target list
                        const newIndex = this.targetList.indexOf(item);
                        this.targetList.splice(newIndex, 1);
                    });

                    // remove loading for all successfull items
                    list.forEach(item => this.setLoading(item, false));
                });
        } else {
            list.forEach(item => {
                this.setLoading(item, false);
            });
        }
    }

    removeAll () {
        const list = this.targetList.filter(item => !this.isLoading(item));
        if (list.length === 0) {
            return;
        }
        list.forEach(item => {
            // move to source list and set loading
            this.sourceList.push(item);
            this.setLoading(item, true);

            // remove from target list
            const newIndex = this.targetList.indexOf(item);
            this.targetList.splice(newIndex, 1);
        });
        if (this.onAdd) {
            this.onAdd({ items: list })
                .then(() => {
                    // all items successfully moved, remove loading
                    list.forEach(item => this.setLoading(item, false));
                }).catch(failedItems => {
                    // some or all items failed to move
                    failedItems.forEach(item => {
                        // move back to target list and remove loading
                        this.targetList.push(item);
                        this.setLoading(item, false);

                        // remove from source list
                        const newIndex = this.sourceList.indexOf(item);
                        this.sourceList.splice(newIndex, 1);
                    });

                    // remove loading for all successfull items
                    list.forEach(item => this.setLoading(item, false));
                });
        } else {
            list.forEach(item => {
                this.setLoading(item, false);
            });
        }
    }
}

