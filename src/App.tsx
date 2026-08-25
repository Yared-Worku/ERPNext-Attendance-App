import '../src/locales/i18n';
import React, { useEffect, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'nativewind'; // IMPORT FROM NATIVEWIND
import AsyncStorage from '@react-native-async-storage/async-storage'; // Added this import
import { RootNavigator } from './navigation/RootNavigator';
import { useAuthStore } from './store';
import { getSavedSession } from './services/storage/sessionStorage';
import { setBaseUrl } from './services/api/client';
import '../global.css';
import { lightColors, darkColors } from './shared/theme/colors';

export default function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const finishSessionCheck = useAuthStore((state) => state.finishSessionCheck);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);

  // 1. Destructure setColorScheme to apply the saved theme on load
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // 2. Select the correct semantic color palette
  const activeColors = isDarkMode ? darkColors : lightColors;

  // 3. Dynamically construct the React Navigation theme
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

  // Load Saved Theme
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

  // Load Saved Session
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