import { IDesignationAdd, IDesignationEdit, IDesignationPager, IDesignationSingle, IDesignationQueryParams, IDesignationPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getDesignations = async (queryParams: IDesignationQueryParams | null) => {
  const url = `/designations${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IDesignationPager>(url);
};

export const getSelectDesignations = async (queryParams: IDesignationQueryParams | null) => {
  const url = `/designations/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getDesignationDetails = async (designationId: string) => {
  const url = `/designations/detail/${designationId}`;
  return await apiClient.get<IDesignationSingle>(url);
};

export const getDesignationEditDetails = async (designationId: string) => {
  const url = `/designations/${designationId}`;
  return await apiClient.get<IDesignationEdit>(url);
};

export const deleteDesignation = async (primaryKeys: Partial<IDesignationPrimaryKeys>) => {
  const { designationId } = primaryKeys;
  const url = `/designations/${designationId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateDesignation = async (data: Partial<IDesignationEdit>) => {
  const { designationId, ...rest } = data;
  const url = `/designations/${designationId}`;
  return await apiClient.put<MutationResponse<IDesignationEdit>>(url, { designationId, ...rest });
};

export const addDesignation = async (data: Partial<IDesignationAdd>) => {
  return await apiClient.post<MutationResponse<IDesignationAdd>>('/designations', data);
};

export const uploadDesignation = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/designations/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadDesignation = async (data: IDesignationPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/designations/upload/${data.designationId}`, { data });
};

