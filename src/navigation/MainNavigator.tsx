import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { MainStackParamList } from './types';
import { useAuthStore } from '../store';

const Stack = createNativeStackNavigator<MainStackParamList>();

const PlaceholderHomeScreen = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">Attendance Module</Text>
      <Text className="text-gray-500 my-2">User: {user}</Text>
      <TouchableOpacity className="bg-red-500 px-6 py-2 rounded-lg" onPress={logout}>
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={PlaceholderHomeScreen} />
  </Stack.Navigator>
);