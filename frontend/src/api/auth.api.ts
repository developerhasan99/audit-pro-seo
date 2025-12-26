import apiClient from './client';

export interface User {
  id: number;
  email: string;
  lang?: string;
  theme?: string;
}

export interface SignUpData {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authApi = {
  signUp: async (data: SignUpData) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  signIn: async (data: SignInData) => {
    const response = await apiClient.post('/auth/signin', data);
    return response.data;
  },

  signOut: async () => {
    const response = await apiClient.post('/auth/signout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete('/auth/account');
    return response.data;
  },
};
