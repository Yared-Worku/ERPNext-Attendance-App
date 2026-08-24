import React from 'react';
import { View, Text } from 'react-native';

export const AuthHeader = () => (
  <View className="items-center mb-8">
    <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
    <Text className="text-gray-500 text-center">Sign in to ERPNext Attendance</Text>
  </View>
);