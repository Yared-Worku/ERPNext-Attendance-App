
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList, MainStackParamList } from './types';
import { useAuthStore } from '../store';
import { LoginScreen } from '../features/auth/screens/LoginScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

// We will update the Main Screen later when we build the Attendance feature
const DummyMainScreen = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <View className="flex-1 items-center justify-center bg-white space-y-4">
      <Text className="text-xl font-bold text-green-600">Home Screen</Text>
      <Text className="text-gray-600">Logged in as: {user}</Text>
      <TouchableOpacity 
        className="bg-red-500 px-6 py-2 rounded-lg mt-4" 
        onPress={logout}
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export const RootNavigator = () => {
  // Listen directly to the global Zustand store!
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); 

  return isAuthenticated ? (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={DummyMainScreen} />
    </MainStack.Navigator>
  ) : (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};