export default class {
    constructor (ouiCriteriaAdderConfigurationProvider) {
        "ngInject";

        this.ouiCriteriaAdderConfigurationProvider = ouiCriteriaAdderConfigurationProvider;
    }

    setLocale (locale) {
        this.ouiCriteriaAdderConfigurationProvider.setLocale(locale);
    }

    $get () {
        return {
            ouiCriteriaAdderConfiguration: this.ouiCriteriaAdderConfigurationProvider.$get()
        };
    }
}
