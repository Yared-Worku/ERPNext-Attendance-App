// src/shared/components/LanguageSwitcher.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const isAm = i18n.language === 'am';

  return (
    <View className="flex-row bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
      <TouchableOpacity
        onPress={() => i18n.changeLanguage('en')}
        className={`px-3 py-1 rounded-full ${!isAm ? 'bg-blue-600' : 'bg-transparent'}`}
      >
        <Text className={`text-xs font-medium ${!isAm ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
          EN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => i18n.changeLanguage('am')}
        className={`px-3 py-1 rounded-full ${isAm ? 'bg-blue-600' : 'bg-transparent'}`}
      >
        <Text className={`text-xs font-medium ${isAm ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
          አማ
        </Text>
      </TouchableOpacity>
    </View>
  );
};