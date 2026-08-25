import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveSession, clearSession, SavedSession } from '../services/storage/sessionStorage';

export interface PendingCheckin {
  id: string;
  userEmail: string;
  log_type: 'IN' | 'OUT';
  latitude: number;
  longitude: number;
  timestamp: string;
  attempts: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  baseUrl: string | null;
  isLoadingSession: boolean;
  login: (baseUrl: string, username: string) => void;
  logout: () => void;
  restoreSession: (session: SavedSession) => void;
  finishSessionCheck: () => void;

  // Offline Queue Extensions
  queue: PendingCheckin[];
  addToQueue: (item: Omit<PendingCheckin, 'id' | 'attempts'>) => void;
  removeFromQueue: (id: string) => void;
  incrementAttempts: (id: string) => void;
  clearQueue: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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

      // Offline Queue Implementations
      queue: [],
      addToQueue: (item) =>
        set((state) => ({
          queue: [
            ...state.queue,
            {
              ...item,
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              attempts: 0,
            },
          ],
        })),
      removeFromQueue: (id) =>
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        })),
      incrementAttempts: (id) =>
        set((state) => ({
          queue: state.queue.map((item) =>
            item.id === id ? { ...item, attempts: item.attempts + 1 } : item
          ),
        })),
      clearQueue: () => set({ queue: [] }),
    }),
    {
      name: 'erpnext-attendance-auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist queue across sessions, keep auth state hydrated via sessionStorage
      partialize: (state) => ({ queue: state.queue }),
    }
  )
);