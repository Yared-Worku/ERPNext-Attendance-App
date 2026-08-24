
import { create } from 'zustand';
import { saveSession, clearSession, SavedSession } from '../services/storage/sessionStorage';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  baseUrl: string | null;
  isLoadingSession: boolean;
  login: (baseUrl: string, username: string) => void;
  logout: () => void;
  restoreSession: (session: SavedSession) => void;
  finishSessionCheck: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  baseUrl: null,
  isLoadingSession: true,

  login: (baseUrl, username) => {
    saveSession({ baseUrl, user: username });
    set({ isAuthenticated: true, user: username, baseUrl });
  },

  logout: () => {
    clearSession();
    set({ isAuthenticated: false, user: null, baseUrl: null });
  },

  restoreSession: (session) => {
    set({
      isAuthenticated: true,
      user: session.user,
      baseUrl: session.baseUrl,
      isLoadingSession: false,
    });
  },

  finishSessionCheck: () => {
    set({ isLoadingSession: false });
  },
}));