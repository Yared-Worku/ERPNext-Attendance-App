import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getSavedSession, loginToERPNext } from '../../../shared/services/auth';

export function useLogin() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-check saved session on mount (matching useAttendance permission check pattern)
  useEffect(() => {
    (async () => {
      try {
        const { serverUrl: savedUrl, user: savedUser } = await getSavedSession();
        if (savedUrl && savedUser) {
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingSession(false);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!serverUrl || !username || !password) {
      const msg = 'Please enter Server URL, Username and Password.';
      setErrorMessage(msg);
      Alert.alert('Validation Error', msg);
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

      setIsAuthenticated(true);
    } catch (error: any) {
      const message = error.message || 'Failed to submit login';
      setErrorMessage(`Error: ${message}`);
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  return {
    isCheckingSession,
    isAuthenticated,
    loading,
    serverUrl,
    setServerUrl,
    username,
    setUsername,
    password,
    setPassword,
    errorMessage,
    handleLogin,
  };
}