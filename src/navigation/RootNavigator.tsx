import React from 'react';
import { useAuthStore } from '../store';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};