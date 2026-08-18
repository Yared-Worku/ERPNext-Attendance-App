// import * as SecureStore from 'expo-secure-store';
// import { API_BASE_URL, API_TIMEOUT_MS } from '../constants/config';

// export interface LoginCredentials {
//   serverUrl?: string;
//   usr: string;
//   pwd: string;
// }

// const STORAGE_KEYS = {
//   SERVER_URL: 'erp_server_url',
//   USER: 'erp_user',
// };

// export async function loginToERPNext(payload: LoginCredentials) {
//   const baseUrl = (payload.serverUrl || API_BASE_URL).replace(/\/+$/, '');
//   const loginEndpoint = `${baseUrl}/api/method/login`;

//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

//   try {
//     const response = await fetch(loginEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         usr: payload.usr,
//         pwd: payload.pwd,
//       }),
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `Server responded with status ${response.status}`);
//     }

//     const data = await response.json();

//     if (data.message === 'Logged In') {
//       await SecureStore.setItemAsync(STORAGE_KEYS.SERVER_URL, baseUrl);
//       await SecureStore.setItemAsync(STORAGE_KEYS.USER, payload.usr);
//       return data;
//     } else {
//       throw new Error('Invalid username or password.');
//     }
//   } catch (error: any) {
//     clearTimeout(timeoutId);
//     if (error.name === 'AbortError') {
//       throw new Error(`Connection timed out (${API_TIMEOUT_MS / 1000}s). Ensure the server is reachable.`);
//     }
//     throw error;
//   }
// }

// export async function getSavedSession() {
//   const serverUrl = await SecureStore.getItemAsync(STORAGE_KEYS.SERVER_URL);
//   const user = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
//   return { 
//     serverUrl: serverUrl || API_BASE_URL, 
//     user 
//   };
// }

// export async function logoutERPNext() {
//   await SecureStore.deleteItemAsync(STORAGE_KEYS.SERVER_URL);
//   await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
// }


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
  const baseUrl = (payload.serverUrl || API_BASE_URL).replace(/\/+$/, '');
  const loginEndpoint = `${baseUrl}/api/method/login`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(loginEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usr: payload.usr, pwd: payload.pwd }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.message === 'Logged In') {
        await SecureStore.setItemAsync(STORAGE_KEYS.SERVER_URL, baseUrl);
        await SecureStore.setItemAsync(STORAGE_KEYS.USER, payload.usr);
        return data;
      }
    }
    throw new Error('Invalid username or password');
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Fallback Mock for testing before ERPNext is integrated
    if (__DEV__) {
      console.warn('ERPNext unavailable. Falling back to Mock Login.');
      await SecureStore.setItemAsync(STORAGE_KEYS.SERVER_URL, baseUrl);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, payload.usr);
      return { message: 'Logged In', user: payload.usr };
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