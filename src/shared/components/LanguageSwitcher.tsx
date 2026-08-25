
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <View className="flex-row justify-center gap-2 p-2 bg-gray-100 dark:bg-gray-800">
      <TouchableOpacity
        onPress={() => i18n.changeLanguage('en')}
        className={`px-3 py-1.5 rounded-md ${i18n.language === 'en' ? 'bg-blue-600' : 'bg-gray-200'}`}
      >
        <Text className={i18n.language === 'en' ? 'text-white font-bold' : 'text-gray-700'}>
          English
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => i18n.changeLanguage('am')}
        className={`px-3 py-1.5 rounded-md ${i18n.language === 'am' ? 'bg-blue-600' : 'bg-gray-200'}`}
      >
        <Text className={i18n.language === 'am' ? 'text-white font-bold' : 'text-gray-700'}>
          አማርኛ
        </Text>
      </TouchableOpacity>
    </View>
  );
};