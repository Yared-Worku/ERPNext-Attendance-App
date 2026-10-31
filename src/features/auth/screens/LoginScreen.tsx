import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { AuthHeader } from '../components/AuthHeader';
import { LoginForm } from '../components/LoginForm';

export const LoginScreen = () => (

  <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
    <View className="flex-1 justify-center px-6">
      <AuthHeader />
      <LoginForm />
    </View>
  </SafeAreaView>
);