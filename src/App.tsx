import '../src/locales/i18n';
import React, { useEffect, useMemo, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'nativewind'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as Notifications from 'expo-notifications'; 

import { RootNavigator } from './navigation/RootNavigator';
import { useAuthStore } from './store';
import { getSavedSession } from './services/storage/sessionStorage';
import { apiClient, setBaseUrl } from './services/api/client'; 
import { registerForPushNotificationsAsync } from './services/device/notifications'; 
import '../global.css';
import { lightColors, darkColors } from './shared/theme/colors';

export default function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const finishSessionCheck = useAuthStore((state) => state.finishSessionCheck);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const user = useAuthStore((state: any) => state.user); 

  const { colorScheme, setColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const activeColors = isDarkMode ? darkColors : lightColors;

  // React 19 requires an explicit initial value (null) for useRef
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const AppTheme = useMemo(() => {
    const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: activeColors.background, 
        text: activeColors.text,             
        card: activeColors.card,             
        border: activeColors.border,         
        primary: activeColors.primary,       
      },
    };
  }, [isDarkMode, activeColors]);

  // 1. Load Saved Theme
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@app_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setColorScheme(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadSavedTheme();
  }, [setColorScheme]);

  // 2. Load Saved Session
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

  // 3. Setup Push Notifications
  useEffect(() => {
    if (user && !isLoadingSession) {
      const userIdentifier = typeof user === 'string' 
        ? user 
        : (user as any)?.user || (user as any)?.employee;

      registerForPushNotificationsAsync().then(token => {
        if (token && userIdentifier) {
          saveTokenToFrappe(token, userIdentifier);
        }
      });

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received in foreground:', notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        console.log('User tapped notification, payload:', data);
      });

      return () => {
        // Use the .remove() method directly on the subscription object
        if (notificationListener.current) notificationListener.current.remove();
        if (responseListener.current) responseListener.current.remove();
      };
    }
  }, [user, isLoadingSession]);

  const saveTokenToFrappe = async (pushToken: string, userIdentifier: string) => {
    try {
      await apiClient.post('/api/method/your_custom_app.api.save_fcm_token', {
        user: userIdentifier,
        token: pushToken
      });
      console.log('Push token synced to Frappe successfully.');
    } catch (error) {
      // It's normal for this to fail until the Frappe endpoint is created
      console.warn('Failed to sync push token to backend (Endpoint likely missing):', error);
    }
  };

  if (isLoadingSession) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900">
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={AppTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}