import { ICompetencyAdd, ICompetencyEdit, ICompetencyPager, ICompetencySingle, ICompetencyQueryParams, ICompetencyPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getCompetencies = async (queryParams: ICompetencyQueryParams | null) => {
  const url = `/competencies${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<ICompetencyPager>(url);
};

export const getSelectCompetencies = async (queryParams: ICompetencyQueryParams | null) => {
  const url = `/competencies/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getCompetencyDetails = async (competencyId: string) => {
  const url = `/competencies/detail/${competencyId}`;
  return await apiClient.get<ICompetencySingle>(url);
};

export const getCompetencyEditDetails = async (competencyId: string) => {
  const url = `/competencies/${competencyId}`;
  return await apiClient.get<ICompetencyEdit>(url);
};

export const deleteCompetency = async (primaryKeys: Partial<ICompetencyPrimaryKeys>) => {
  const { competencyId } = primaryKeys;
  const url = `/competencies/${competencyId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateCompetency = async (data: Partial<ICompetencyEdit>) => {
  const { competencyId, ...rest } = data;
  const url = `/competencies/${competencyId}`;
  return await apiClient.put<MutationResponse<ICompetencyEdit>>(url, { competencyId, ...rest });
};

export const addCompetency = async (data: Partial<ICompetencyAdd>) => {
  return await apiClient.post<MutationResponse<ICompetencyAdd>>('/competencies', data);
};

export const uploadCompetency = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/competencies/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadCompetency = async (data: ICompetencyPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/competencies/upload/${data.competencyId}`, { data });
};

