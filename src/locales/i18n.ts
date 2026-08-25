import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from './en.json';
import am from './am.json';

const LANGUAGE_KEY = 'user_language';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: (callback: (lng: string) => void) => {
    (async () => {
      try {
        // 1. Check for stored language preference
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage) {
          return callback(savedLanguage);
        }

        // 2. Fall back to system language
        const deviceLanguage = Localization.getLocales()?.[0]?.languageCode ?? 'en';
        callback(deviceLanguage === 'am' ? 'am' : 'en');
      } catch {
        callback('en');
      }
    })();
  },
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lng);
    } catch (e) {
      console.error('Failed to save language preference:', e);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
    },
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;