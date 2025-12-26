import { create } from 'zustand';
import { authApi, User } from '../api/auth.api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.signIn({ email, password });
      set({ user: response.user, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to sign in', 
        loading: false 
      });
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.signUp({ email, password });
      set({ user: response.user, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to sign up', 
        loading: false 
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await authApi.signOut();
      set({ user: null, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to sign out', 
        loading: false 
      });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const response = await authApi.getMe();
      set({ user: response.user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
