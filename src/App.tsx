import './locales/i18n';

import React, { useEffect } from 'react';
import { View, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { LanguageSwitcher } from './shared/components/LanguageSwitcher';
import { RootNavigator } from './navigation/RootNavigator';
import { useAuthStore } from './store';
import { getSavedSession } from './services/storage/sessionStorage';
import { setBaseUrl } from './services/api/client';
import '../global.css';

export default function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const finishSessionCheck = useAuthStore((state) => state.finishSessionCheck);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSavedSession();
      if (session) {
        setBaseUrl(session.baseUrl);
        restoreSession(session);
      } else {
        finishSessionCheck();
      }
    };
    checkSession();
  }, []);

  if (isLoadingSession) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#ffffff',
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Top action bar positioned safely under status icons */}
      <View className="flex-row justify-end px-4 py-1 bg-white border-b border-gray-100">
        <LanguageSwitcher />
      </View>

      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
}