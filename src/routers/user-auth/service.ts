import { UserLoginRequest, UserLoginResponse, UserProfile } from './types';
import apiClient from '@/services/apiClient';

export const userLogin = async (credentials: UserLoginRequest) => {
  return await apiClient.post<UserLoginResponse>('/users-auth/login', credentials);
};

export const userRegister = async (userData: Partial<UserProfile>) => {
  return await apiClient.post<UserLoginResponse>('/users-auth/register', userData);
};

export const getUserProfile = async (token?: string) => {
  return await apiClient.get<UserProfile>('/users-auth/profile', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const updateUserProfile = async (profileData: Partial<UserProfile>, userId: string) => {
  return await apiClient.put<UserProfile>(`/users-auth/profile/${userId}`, profileData);
};

export const userLogout = async (token?: string) => {
  if (token) {
    return await apiClient.post<void>('/users-auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
};

export const userRefreshToken = async (refreshToken: string) => {
  return await apiClient.post<UserLoginResponse>('/users-auth/refresh', {
    refreshToken,
  });
};

export const userForgotPassword = async (email: string) => {
  return await apiClient.post<{ message: string }>('/users-auth/forgot-password', { email });
};

export const userResetPassword = async (token: string, newPassword: string) => {
  return await apiClient.post<{ message: string }>('/users-auth/reset-password', { token, newPassword });
};

export const userChangePassword = async (currentPassword: string, newPassword: string, userId: string) => {
  return await apiClient.put<{ message: string }>(`/users-auth/change-password/${userId}`, { currentPassword, newPassword });
};
