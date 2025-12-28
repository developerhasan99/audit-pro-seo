import { create } from "zustand";
import { authApi, User } from "../api/auth.api";

interface AuthState {
  user: User | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.signIn({ email, password });
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      set({ user: response.user, loading: false, initialized: true });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to sign in",
        loading: false,
      });
      throw error;
    }
  },

  signUp: async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.signUp({
        email,
        password,
        firstName,
        lastName,
      });
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      set({ user: response.user, loading: false, initialized: true });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to sign up",
        loading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await authApi.signOut();
      localStorage.removeItem("token");
      set({ user: null, loading: false });
    } catch (error: any) {
      localStorage.removeItem("token");
      set({
        user: null,
        error: error.response?.data?.error || "Failed to sign out",
        loading: false,
      });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, initialized: true, loading: false });
      return;
    }

    set({ loading: true });
    try {
      const response = await authApi.getMe();
      set({ user: response.user, loading: false, initialized: true });
    } catch (error) {
      localStorage.removeItem("token");
      set({ user: null, loading: false, initialized: true });
    }
  },

  clearError: () => set({ error: null }),
}));
