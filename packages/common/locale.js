const defaultLocale = "en_GB";

export function getTranslations (translations, locale) {
    if (translations[locale]) {
        return translations[locale];
    }

    return translations[defaultLocale] || {};
}
