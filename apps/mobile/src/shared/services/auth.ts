import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT_MS } from '../constants/config';

export interface LoginCredentials {
  usr: string;
  pwd: string;
}

const STORAGE_KEYS = {
  USER: 'erp_user',
};

export async function loginToERPNext(payload: LoginCredentials) {
  const cleanUser = payload.usr.trim().toLowerCase();
  const cleanPassword = payload.pwd.trim();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
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
      throw new Error(`Cannot reach server at ${API_BASE_URL}. Check Wi-Fi connection.`);
    }

    throw error;
  }
}

export async function getSavedSession() {
  const user = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
  return { 
    serverUrl: API_BASE_URL, 
    user 
  };
}

export async function logoutERPNext() {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
}