import { IUserAdd, IUserEdit, IUserPager, IUserSingle, IUserQueryParams, IUserPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getUsers = async (queryParams: IUserQueryParams | null) => {
  const url = `/users${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IUserPager>(url);
};

export const getSelectUsers = async (queryParams: IUserQueryParams | null) => {
  const url = `/users/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getUserDetails = async (userId: string) => {
  const url = `/users/detail/${userId}`;
  return await apiClient.get<IUserSingle>(url);
};

export const getUserEditDetails = async (userId: string) => {
  const url = `/users/${userId}`;
  return await apiClient.get<IUserEdit>(url);
};

export const deleteUser = async (primaryKeys: Partial<IUserPrimaryKeys>) => {
  const { userId } = primaryKeys;
  const url = `/users/${userId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateUser = async (data: Partial<IUserEdit>) => {
  const { userId, ...rest } = data;
  const url = `/users/${userId}`;
  return await apiClient.put<MutationResponse<IUserEdit>>(url, { userId, ...rest });
};

export const addUser = async (data: Partial<IUserAdd>) => {
  return await apiClient.post<MutationResponse<IUserAdd>>('/users', data);
};

export const uploadUser = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/users/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadUser = async (data: IUserPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/users/upload/${data.userId}`, { data });
};

