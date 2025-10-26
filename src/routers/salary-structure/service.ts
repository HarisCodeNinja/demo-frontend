import { ISalaryStructureAdd, ISalaryStructureEdit, ISalaryStructurePager, ISalaryStructureSingle, ISalaryStructureQueryParams, ISalaryStructurePrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getSalaryStructures = async (queryParams: ISalaryStructureQueryParams | null) => {
  const url = `/salary-structures${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<ISalaryStructurePager>(url);
};

export const getSelectSalaryStructures = async (queryParams: ISalaryStructureQueryParams | null) => {
  const url = `/salary-structures/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getSalaryStructureDetails = async (salaryStructureId: string) => {
  const url = `/salary-structures/detail/${salaryStructureId}`;
  return await apiClient.get<ISalaryStructureSingle>(url);
};

export const getSalaryStructureEditDetails = async (salaryStructureId: string) => {
  const url = `/salary-structures/${salaryStructureId}`;
  return await apiClient.get<ISalaryStructureEdit>(url);
};

export const deleteSalaryStructure = async (primaryKeys: Partial<ISalaryStructurePrimaryKeys>) => {
  const { salaryStructureId } = primaryKeys;
  const url = `/salary-structures/${salaryStructureId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateSalaryStructure = async (data: Partial<ISalaryStructureEdit>) => {
  const { salaryStructureId, ...rest } = data;
  const url = `/salary-structures/${salaryStructureId}`;
  return await apiClient.put<MutationResponse<ISalaryStructureEdit>>(url, { salaryStructureId, ...rest });
};

export const addSalaryStructure = async (data: Partial<ISalaryStructureAdd>) => {
  return await apiClient.post<MutationResponse<ISalaryStructureAdd>>('/salary-structures', data);
};

export const uploadSalaryStructure = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/salary-structures/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadSalaryStructure = async (data: ISalaryStructurePrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/salary-structures/upload/${data.salaryStructureId}`, { data });
};

