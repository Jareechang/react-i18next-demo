import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const options = {
    debug: true,
    fallbackLng: 'en',
    whitelist: ['en', 'es'],

    interpolation: {
        escapeValue: false,
    }
};

const isServer = typeof window === 'undefined';

if (!isServer) {
    i18n
        .use(Backend)
        .use(initReactI18next)
        .use(LanguageDetector);
}

if (!i18n.isInitialized) {
    i18n.init(options);
}

export default i18n;
