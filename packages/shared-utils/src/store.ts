import { create } from 'zustand';
import { User } from './types';

interface UserState {
  userData: User | null;
  isLoggedIn: boolean;
  token: string | null;
  setUserData: (data: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  userData: null,
  isLoggedIn: false,
  token: null,
  setUserData: (data) => set({ userData: data }),
  setToken: (token) => {
    localStorage.setItem('userToken', token);
    set({ token, isLoggedIn: true });
  },
  logout: () => {
    localStorage.removeItem('userToken');
    set({ userData: null, isLoggedIn: false, token: null });
  },
  initializeAuth: () => {
    const savedToken = localStorage.getItem('userToken');
    if (savedToken) {
      set({ token: savedToken, isLoggedIn: true });
    }
  },
}));