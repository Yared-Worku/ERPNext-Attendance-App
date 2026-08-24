// src/features/auth/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '../../../store';
import { loginToFrappe } from '../api/authApi';

export const LoginScreen = () => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!url || !username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await loginToFrappe({
        baseUrl: url.trim(),
        usr: username.trim(),
        pwd: password,
      });

      // Update Zustand state upon successful response
      login(username.trim());
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to connect to Frappe server';
      Alert.alert('Authentication Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-10">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
          <Text className="text-gray-500 text-center">Sign in to ERPNext Attendance</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Frappe Site URL</Text>
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
              placeholder="Enter your email or username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
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
            className="w-full bg-blue-600 rounded-xl py-4 mt-4 items-center justify-center"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};