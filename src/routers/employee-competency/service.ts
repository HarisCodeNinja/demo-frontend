import { IEmployeeCompetencyAdd, IEmployeeCompetencyEdit, IEmployeeCompetencyPager, IEmployeeCompetencySingle, IEmployeeCompetencyQueryParams, IEmployeeCompetencyPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getEmployeeCompetencies = async (queryParams: IEmployeeCompetencyQueryParams | null) => {
  const url = `/employee-competencies${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IEmployeeCompetencyPager>(url);
};

export const getSelectEmployeeCompetencies = async (queryParams: IEmployeeCompetencyQueryParams | null) => {
  const url = `/employee-competencies/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getEmployeeCompetencyDetails = async (employeeCompetencyId: string) => {
  const url = `/employee-competencies/detail/${employeeCompetencyId}`;
  return await apiClient.get<IEmployeeCompetencySingle>(url);
};

export const getEmployeeCompetencyEditDetails = async (employeeCompetencyId: string) => {
  const url = `/employee-competencies/${employeeCompetencyId}`;
  return await apiClient.get<IEmployeeCompetencyEdit>(url);
};

export const deleteEmployeeCompetency = async (primaryKeys: Partial<IEmployeeCompetencyPrimaryKeys>) => {
  const { employeeCompetencyId } = primaryKeys;
  const url = `/employee-competencies/${employeeCompetencyId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateEmployeeCompetency = async (data: Partial<IEmployeeCompetencyEdit>) => {
  const { employeeCompetencyId, ...rest } = data;
  const url = `/employee-competencies/${employeeCompetencyId}`;
  return await apiClient.put<MutationResponse<IEmployeeCompetencyEdit>>(url, { employeeCompetencyId, ...rest });
};

export const addEmployeeCompetency = async (data: Partial<IEmployeeCompetencyAdd>) => {
  return await apiClient.post<MutationResponse<IEmployeeCompetencyAdd>>('/employee-competencies', data);
};

export const uploadEmployeeCompetency = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/employee-competencies/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadEmployeeCompetency = async (data: IEmployeeCompetencyPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/employee-competencies/upload/${data.employeeCompetencyId}`, { data });
};

