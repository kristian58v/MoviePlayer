// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './en/translation.json';
import translationBG from './bg/translation.json';

const resources = {
    en: {
        translation: translationEN
    },
    bg: {
        translation: translationBG
    }
};

i18n
    .use(HttpBackend) // Load translations over http
    .use(LanguageDetector) // Detects user language
    .use(initReactI18next) // Passes i18n to React
    .init({
        resources,
        fallbackLng: 'en', // Use English if detected language is not available
        debug: true, // Set to false in production
        interpolation: {
            escapeValue: false, // React already safes from XSS
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json'
        },
    });

export default i18n;
