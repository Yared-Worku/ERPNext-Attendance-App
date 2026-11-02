// src/shared/components/LanguageSwitcher.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const isAm = i18n.language === 'am';

  return (
    <View className="flex-row bg-slate-100 dark:bg-slate-800 p-1 rounded-full self-start">
      <TouchableOpacity
        onPress={() => i18n.changeLanguage('en')}
        activeOpacity={0.7}
        className={`px-3 py-1 rounded-full ${!isAm ? 'bg-indigo-600' : 'bg-transparent'}`}
      >
        <Text className={`text-xs font-semibold ${!isAm ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
          EN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => i18n.changeLanguage('am')}
        activeOpacity={0.7}
        className={`px-3 py-1 rounded-full ${isAm ? 'bg-indigo-600' : 'bg-transparent'}`}
      >
        <Text className={`text-xs font-semibold ${isAm ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
          አማ
        </Text>
      </TouchableOpacity>
    </View>
  );
};