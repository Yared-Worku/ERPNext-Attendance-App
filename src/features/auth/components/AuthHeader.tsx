import React from 'react';
import { View, Text } from 'react-native';

export const AuthHeader = () => (
  <View className="items-center mb-8">
    {/* Added dark:text-white for the main title */}
    <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
      Welcome Back
    </Text>
    {/* Added dark:text-gray-400 for the subtitle to keep it slightly muted */}
    <Text className="text-gray-500 dark:text-gray-400 text-center">
      Sign in to ERPNext Attendance
    </Text>
  </View>
);