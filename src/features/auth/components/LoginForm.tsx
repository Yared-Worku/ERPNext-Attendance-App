import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next'; // 1. Imported translation hook
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
  const { t } = useTranslation(); // 2. Initialized the hook
  const [baseUrl, setBaseUrl] = useState('');
  const [usr, setUsr] = useState('');
  const [pwd, setPwd] = useState('');
  const { executeLogin, loading } = useAuth();

  const handleSubmit = () => {
    executeLogin({ baseUrl: baseUrl.trim(), usr: usr.trim(), pwd });
  };

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
          {/* 3. Applied translation for Site URL */}
          {t('auth.siteUrl', 'Frappe Site URL')}
        </Text>
        <TextInput
          className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
          placeholder="https://erp.company.com"
          placeholderTextColor="#9ca3af"
          value={baseUrl}
          onChangeText={setBaseUrl}
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
          {/* 3. Applied translation for Username/Email */}
          {t('auth.username', 'Username / Email')}
        </Text>
        <TextInput
          className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
          placeholder="user@company.com"
          placeholderTextColor="#9ca3af"
          value={usr}
          onChangeText={setUsr}
          autoCapitalize="none"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
          {/* 3. Applied translation for Password */}
          {t('auth.password', 'Password')}
        </Text>
        <TextInput
          className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
          value={pwd}
          onChangeText={setPwd}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className="w-full bg-blue-600 dark:bg-blue-500 rounded-xl py-4 mt-4 items-center justify-center"
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-bold text-lg">
            {/* 3. Applied translation for Sign In button */}
            {t('auth.signIn', 'Sign In')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};