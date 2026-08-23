
import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList, MainStackParamList } from './types';

// Temporary placeholder screens (we will move these to the features folder later)
const DummyLoginScreen = () => (
  <View className="flex-1 items-center justify-center bg-gray-100">
    <Text className="text-xl font-bold text-gray-800">Login Screen</Text>
    <Text className="text-gray-500 mt-2">Waiting for Frappe HRMS connection...</Text>
  </View>
);

const DummyMainScreen = () => (
  <View className="flex-1 items-center justify-center bg-white">
    <Text className="text-xl font-bold text-green-600">Home Screen</Text>
  </View>
);

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

export const RootNavigator = () => {
  // TODO: We will replace this with Zustand state later
  const isAuthenticated = false; 

  return isAuthenticated ? (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={DummyMainScreen} />
    </MainStack.Navigator>
  ) : (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={DummyLoginScreen} />
    </AuthStack.Navigator>
  );
};