import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginToERPNext, LoginCredentials } from '../../../shared/services/auth';

export function useLogin() {
  const router = useRouter();
  const [serverUrl, setServerUrl] = useState('https://your-erpnext-domain.com');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!serverUrl || !username || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await loginToERPNext({
        serverUrl,
        usr: username,
        pwd: password,
      });

      // Navigate to main attendance screen on success
      router.replace('/');
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Login failed.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    serverUrl,
    setServerUrl,
    username,
    setUsername,
    password,
    setPassword,
    loading,
    errorMessage,
    handleLogin,
  };
}