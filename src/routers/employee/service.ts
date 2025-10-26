import { IEmployeeAdd, IEmployeeEdit, IEmployeePager, IEmployeeSingle, IEmployeeQueryParams, IEmployeePrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getEmployees = async (queryParams: IEmployeeQueryParams | null) => {
  const url = `/employees${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IEmployeePager>(url);
};

export const getSelectEmployees = async (queryParams: IEmployeeQueryParams | null) => {
  const url = `/employees/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getEmployeeDetails = async (employeeId: string) => {
  const url = `/employees/detail/${employeeId}`;
  return await apiClient.get<IEmployeeSingle>(url);
};

export const getEmployeeEditDetails = async (employeeId: string) => {
  const url = `/employees/${employeeId}`;
  return await apiClient.get<IEmployeeEdit>(url);
};

export const deleteEmployee = async (primaryKeys: Partial<IEmployeePrimaryKeys>) => {
  const { employeeId } = primaryKeys;
  const url = `/employees/${employeeId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateEmployee = async (data: Partial<IEmployeeEdit>) => {
  const { employeeId, ...rest } = data;
  const url = `/employees/${employeeId}`;
  return await apiClient.put<MutationResponse<IEmployeeEdit>>(url, { employeeId, ...rest });
};

export const addEmployee = async (data: Partial<IEmployeeAdd>) => {
  return await apiClient.post<MutationResponse<IEmployeeAdd>>('/employees', data);
};

export const uploadEmployee = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/employees/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadEmployee = async (data: IEmployeePrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/employees/upload/${data.employeeId}`, { data });
};

