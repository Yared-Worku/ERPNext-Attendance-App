import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_TIMEOUT_MS } from '../constants/config';

export interface LoginCredentials {
  serverUrl?: string;
  usr: string;
  pwd: string;
}

const STORAGE_KEYS = {
  SERVER_URL: 'erp_server_url',
  USER: 'erp_user',
};

export async function loginToERPNext(payload: LoginCredentials) {
  const targetUrl = payload.serverUrl?.trim() || API_BASE_URL;
  let rawUrl = targetUrl.replace(/\/+$/, '');

  if (!/^https?:\/\//i.test(rawUrl)) {
    rawUrl = `http://${rawUrl}`;
  }

  const cleanUser = payload.usr.trim().toLowerCase();
  const cleanPassword = payload.pwd.trim();
  const loginEndpoint = `${rawUrl}/api/method/login`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(loginEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': 'development.localhost',
      },
      body: JSON.stringify({
        usr: cleanUser,
        pwd: cleanPassword,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();

    if (responseText.trim().startsWith('<')) {
      throw new Error(
        'Server returned HTML instead of JSON. Ensure "bench set-default-site development.localhost" is set.'
      );
    }

    const data = JSON.parse(responseText);

    if (response.ok && (data.message === 'Logged In' || data.home_page)) {
      await SecureStore.setItemAsync(STORAGE_KEYS.SERVER_URL, rawUrl);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, cleanUser);
      return data;
    }

    let serverErrorMsg = 'Invalid username or password';
    if (data._server_messages) {
      try {
        const parsed = JSON.parse(data._server_messages);
        const msgObj = typeof parsed[0] === 'string' ? JSON.parse(parsed[0]) : parsed[0];
        serverErrorMsg = msgObj.message || serverErrorMsg;
      } catch {
        // Fallback
      }
    } else if (data.message) {
      serverErrorMsg = typeof data.message === 'string' ? data.message : serverErrorMsg;
    }

    throw new Error(serverErrorMsg);
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Connection timed out. Check if server is running.');
    }
    if (error.message === 'Network request failed') {
      throw new Error(`Cannot reach server at ${rawUrl}. Check Wi-Fi connection.`);
    }

    throw error;
  }
}

export async function getSavedSession() {
  const serverUrl = await SecureStore.getItemAsync(STORAGE_KEYS.SERVER_URL);
  const user = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
  return { 
    serverUrl: serverUrl || API_BASE_URL, 
    user 
  };
}

export async function logoutERPNext() {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.SERVER_URL);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
}