import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getSavedSession, loginToERPNext } from '../../../shared/services/auth';
import { API_BASE_URL } from '../../../shared/constants/config';

export function useLogin() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState(API_BASE_URL);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { serverUrl: savedUrl, user: savedUser } = await getSavedSession();
        if (savedUrl) {
          setServerUrl(savedUrl);
        }
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
    const targetServer = serverUrl.trim() || API_BASE_URL;

    if (!username || !password) {
      const msg = 'Please enter Username and Password.';
      setErrorMessage(msg);
      Alert.alert('Validation Error', msg);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await loginToERPNext({
        serverUrl: targetServer,
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
    setIsAuthenticated, 
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