import { IDepartmentAdd, IDepartmentEdit, IDepartmentPager, IDepartmentSingle, IDepartmentQueryParams, IDepartmentPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getDepartments = async (queryParams: IDepartmentQueryParams | null) => {
  const url = `/departments${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IDepartmentPager>(url);
};

export const getSelectDepartments = async (queryParams: IDepartmentQueryParams | null) => {
  const url = `/departments/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getDepartmentDetails = async (departmentId: string) => {
  const url = `/departments/detail/${departmentId}`;
  return await apiClient.get<IDepartmentSingle>(url);
};

export const getDepartmentEditDetails = async (departmentId: string) => {
  const url = `/departments/${departmentId}`;
  return await apiClient.get<IDepartmentEdit>(url);
};

export const deleteDepartment = async (primaryKeys: Partial<IDepartmentPrimaryKeys>) => {
  const { departmentId } = primaryKeys;
  const url = `/departments/${departmentId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateDepartment = async (data: Partial<IDepartmentEdit>) => {
  const { departmentId, ...rest } = data;
  const url = `/departments/${departmentId}`;
  return await apiClient.put<MutationResponse<IDepartmentEdit>>(url, { departmentId, ...rest });
};

export const addDepartment = async (data: Partial<IDepartmentAdd>) => {
  return await apiClient.post<MutationResponse<IDepartmentAdd>>('/departments', data);
};

export const uploadDepartment = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/departments/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadDepartment = async (data: IDepartmentPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/departments/upload/${data.departmentId}`, { data });
};

