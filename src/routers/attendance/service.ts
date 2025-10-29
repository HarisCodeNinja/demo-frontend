import { IAttendanceAdd, IAttendanceEdit, IAttendancePager, IAttendanceSingle, IAttendanceQueryParams, IAttendancePrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getAttendances = async (queryParams: IAttendanceQueryParams | null) => {
  const url = `/attendances${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IAttendancePager>(url);
};

export const getSelectAttendances = async (queryParams: IAttendanceQueryParams | null) => {
  const url = `/attendances/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getAttendanceDetails = async (attendanceId: string) => {
  const url = `/attendances/detail/${attendanceId}`;
  return await apiClient.get<IAttendanceSingle>(url);
};

export const getAttendanceEditDetails = async (attendanceId: string) => {
  const url = `/attendances/${attendanceId}`;
  return await apiClient.get<IAttendanceEdit>(url);
};

export const deleteAttendance = async (primaryKeys: Partial<IAttendancePrimaryKeys>) => {
  const { attendanceId } = primaryKeys;
  const url = `/attendances/${attendanceId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateAttendance = async (data: Partial<IAttendanceEdit>) => {
  const { attendanceId, ...rest } = data;
  const url = `/attendances/${attendanceId}`;
  return await apiClient.put<MutationResponse<IAttendanceEdit>>(url, { attendanceId, ...rest });
};

export const addAttendance = async (data: Partial<IAttendanceAdd>) => {
  return await apiClient.post<MutationResponse<IAttendanceAdd>>('/attendances', data);
};

export const uploadAttendance = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/attendances/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadAttendance = async (data: IAttendancePrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/attendances/upload/${data.attendanceId}`, { data });
};
