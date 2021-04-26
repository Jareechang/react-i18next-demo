import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';

i18n
    // learn more: https://github.com/i18next/i18next-xhr-backend
    .use(Backend)
    // connect with React
    .use(initReactI18next)
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: true,

        lng: 'en',
        fallbackLng: 'en',
        whitelist: ['en', 'es'],

        interpolation: {
            escapeValue: false,
        },

        backend: {
            loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
