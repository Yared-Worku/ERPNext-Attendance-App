import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import am from './am.json';

const resources = {
  en: { translation: en },
  am: { translation: am },
};

// Auto-detect device language or default to English
const deviceLanguage = Localization.getLocales()?.[0]?.languageCode ?? 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage === 'am' ? 'am' : 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React handles XSS safety
  },
});

export default i18n;