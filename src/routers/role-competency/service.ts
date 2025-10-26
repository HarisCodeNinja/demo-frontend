import { IRoleCompetencyAdd, IRoleCompetencyEdit, IRoleCompetencyPager, IRoleCompetencySingle, IRoleCompetencyQueryParams, IRoleCompetencyPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getRoleCompetencies = async (queryParams: IRoleCompetencyQueryParams | null) => {
  const url = `/role-competencies${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IRoleCompetencyPager>(url);
};

export const getSelectRoleCompetencies = async (queryParams: IRoleCompetencyQueryParams | null) => {
  const url = `/role-competencies/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getRoleCompetencyDetails = async (roleCompetencyId: string) => {
  const url = `/role-competencies/detail/${roleCompetencyId}`;
  return await apiClient.get<IRoleCompetencySingle>(url);
};

export const getRoleCompetencyEditDetails = async (roleCompetencyId: string) => {
  const url = `/role-competencies/${roleCompetencyId}`;
  return await apiClient.get<IRoleCompetencyEdit>(url);
};

export const deleteRoleCompetency = async (primaryKeys: Partial<IRoleCompetencyPrimaryKeys>) => {
  const { roleCompetencyId } = primaryKeys;
  const url = `/role-competencies/${roleCompetencyId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateRoleCompetency = async (data: Partial<IRoleCompetencyEdit>) => {
  const { roleCompetencyId, ...rest } = data;
  const url = `/role-competencies/${roleCompetencyId}`;
  return await apiClient.put<MutationResponse<IRoleCompetencyEdit>>(url, { roleCompetencyId, ...rest });
};

export const addRoleCompetency = async (data: Partial<IRoleCompetencyAdd>) => {
  return await apiClient.post<MutationResponse<IRoleCompetencyAdd>>('/role-competencies', data);
};

export const uploadRoleCompetency = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/role-competencies/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadRoleCompetency = async (data: IRoleCompetencyPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/role-competencies/upload/${data.roleCompetencyId}`, { data });
};

