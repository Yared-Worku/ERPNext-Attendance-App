
import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'erpnext_user_session';

export interface SavedSession {
  baseUrl: string;
  user: string;
}

export const saveSession = async (session: SavedSession): Promise<void> => {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to persist session securely:', error);
  }
};

export const getSavedSession = async (): Promise<SavedSession | null> => {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to retrieve persisted session:', error);
    return null;
  }
};

export const clearSession = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session storage:', error);
  }
};