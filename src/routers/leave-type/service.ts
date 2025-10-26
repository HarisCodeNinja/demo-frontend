import { ILeaveTypeAdd, ILeaveTypeEdit, ILeaveTypePager, ILeaveTypeSingle, ILeaveTypeQueryParams, ILeaveTypePrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getLeaveTypes = async (queryParams: ILeaveTypeQueryParams | null) => {
  const url = `/leave-types${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<ILeaveTypePager>(url);
};

export const getSelectLeaveTypes = async (queryParams: ILeaveTypeQueryParams | null) => {
  const url = `/leave-types/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getLeaveTypeDetails = async (leaveTypeId: string) => {
  const url = `/leave-types/detail/${leaveTypeId}`;
  return await apiClient.get<ILeaveTypeSingle>(url);
};

export const getLeaveTypeEditDetails = async (leaveTypeId: string) => {
  const url = `/leave-types/${leaveTypeId}`;
  return await apiClient.get<ILeaveTypeEdit>(url);
};

export const deleteLeaveType = async (primaryKeys: Partial<ILeaveTypePrimaryKeys>) => {
  const { leaveTypeId } = primaryKeys;
  const url = `/leave-types/${leaveTypeId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateLeaveType = async (data: Partial<ILeaveTypeEdit>) => {
  const { leaveTypeId, ...rest } = data;
  const url = `/leave-types/${leaveTypeId}`;
  return await apiClient.put<MutationResponse<ILeaveTypeEdit>>(url, { leaveTypeId, ...rest });
};

export const addLeaveType = async (data: Partial<ILeaveTypeAdd>) => {
  return await apiClient.post<MutationResponse<ILeaveTypeAdd>>('/leave-types', data);
};

export const uploadLeaveType = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/leave-types/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadLeaveType = async (data: ILeaveTypePrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/leave-types/upload/${data.leaveTypeId}`, { data });
};

