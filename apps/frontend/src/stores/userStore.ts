import { create } from 'zustand';
import type { User } from '@guss/shared/types';

interface UserStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setUserAndToken: (user: User, token: string) => void;
  logout: () => void;
}

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
} as const;

const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const useUserStore = create<UserStore>((set) => ({
  user: loadUserFromStorage(),
  token: localStorage.getItem(STORAGE_KEYS.TOKEN),
  setUser: (user) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    set({ user });
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    set({ token });
  },
  setUserAndToken: (user, token) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    set({ user: null, token: null });
  },
}));

