import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export interface LoginCredentials {
  serverUrl: string;
  usr: string;
  pwd: string;
}

const STORAGE_KEYS = {
  SERVER_URL: 'erp_server_url',
  USER: 'erp_user',
  SID: 'erp_sid',
};

export async function loginToERPNext({ serverUrl, usr, pwd }: LoginCredentials) {
  // Normalize URL (strip trailing slash)
  const baseUrl = serverUrl.replace(/\/+$/, '');

  const response = await axios.post(
    `${baseUrl}/api/method/login`,
    { usr, pwd },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    }
  );

  if (response.status === 200 && response.data.message === 'Logged In') {
    // Save server URL and username securely
    await SecureStore.setItemAsync(STORAGE_KEYS.SERVER_URL, baseUrl);
    await SecureStore.setItemAsync(STORAGE_KEYS.USER, usr);
    return response.data;
  } else {
    throw new Error('Invalid username or password.');
  }
}

export async function getSavedSession() {
  const serverUrl = await SecureStore.getItemAsync(STORAGE_KEYS.SERVER_URL);
  const user = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
  return { serverUrl, user };
}

export async function logoutERPNext() {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.SERVER_URL);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
}