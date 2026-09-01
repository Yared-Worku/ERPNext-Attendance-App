import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next'; 

export const AuthHeader = () => {
  const { t } = useTranslation(); 

  return (
    <View className="items-center mb-8">
      <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {t('auth.welcomeBack', 'Welcome Back')}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center">
        {t('auth.signInSubtitle', 'Sign in to ERPNext Attendance')}
      </Text>
    </View>
  );
};