import { ILeaveApplicationAdd, ILeaveApplicationEdit, ILeaveApplicationPager, ILeaveApplicationSingle, ILeaveApplicationQueryParams, ILeaveApplicationPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getLeaveApplications = async (queryParams: ILeaveApplicationQueryParams | null) => {
  const url = `/leave-applications${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<ILeaveApplicationPager>(url);
};

export const getSelectLeaveApplications = async (queryParams: ILeaveApplicationQueryParams | null) => {
  const url = `/leave-applications/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getLeaveApplicationDetails = async (leaveApplicationId: string) => {
  const url = `/leave-applications/detail/${leaveApplicationId}`;
  return await apiClient.get<ILeaveApplicationSingle>(url);
};

export const getLeaveApplicationEditDetails = async (leaveApplicationId: string) => {
  const url = `/leave-applications/${leaveApplicationId}`;
  return await apiClient.get<ILeaveApplicationEdit>(url);
};

export const deleteLeaveApplication = async (primaryKeys: Partial<ILeaveApplicationPrimaryKeys>) => {
  const { leaveApplicationId } = primaryKeys;
  const url = `/leave-applications/${leaveApplicationId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateLeaveApplication = async (data: Partial<ILeaveApplicationEdit>) => {
  const { leaveApplicationId, ...rest } = data;
  const url = `/leave-applications/${leaveApplicationId}`;
  return await apiClient.put<MutationResponse<ILeaveApplicationEdit>>(url, { leaveApplicationId, ...rest });
};

export const addLeaveApplication = async (data: Partial<ILeaveApplicationAdd>) => {
  return await apiClient.post<MutationResponse<ILeaveApplicationAdd>>('/leave-applications', data);
};

export const uploadLeaveApplication = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/leave-applications/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadLeaveApplication = async (data: ILeaveApplicationPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/leave-applications/upload/${data.leaveApplicationId}`, { data });
};

