
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuthStore } from '../../../store';

export const LoginScreen = () => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Connect to our global Zustand store
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    // TODO: We will replace this with the real Frappe REST API call later
    if (username && password) {
      login(username);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6">
        
        <View className="items-center mb-10">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
          <Text className="text-gray-500 text-center">
            Sign in to ERPNext Attendance
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Frappe URL</Text>
            <TextInput
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              placeholder="https://erp.yourcompany.com"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Username / Email</Text>
            <TextInput
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              placeholder="Enter your email"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Password</Text>
            <TextInput
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            className="w-full bg-blue-600 rounded-xl py-4 mt-4 active:bg-blue-700"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-bold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};