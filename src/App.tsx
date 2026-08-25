
import '../src/locales/i18n';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}