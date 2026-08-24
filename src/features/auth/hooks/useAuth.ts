
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../../../store';
import { loginApi, LoginPayload } from '../api/authApi';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const loginStore = useAuthStore((state) => state.login);

  const executeLogin = async (payload: LoginPayload) => {
    if (!payload.baseUrl || !payload.usr || !payload.pwd) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    setLoading(true);
    try {
      await loginApi(payload);
      loginStore(payload.baseUrl, payload.usr);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Authentication failed. Check your server URL and credentials.';
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  return { executeLogin, loading };
};