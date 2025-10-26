import { ICandidateAdd, ICandidateEdit, ICandidatePager, ICandidateSingle, ICandidateQueryParams, ICandidatePrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getCandidates = async (queryParams: ICandidateQueryParams | null) => {
  const url = `/candidates${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<ICandidatePager>(url);
};

export const getSelectCandidates = async (queryParams: ICandidateQueryParams | null) => {
  const url = `/candidates/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getCandidateDetails = async (candidateId: string) => {
  const url = `/candidates/detail/${candidateId}`;
  return await apiClient.get<ICandidateSingle>(url);
};

export const getCandidateEditDetails = async (candidateId: string) => {
  const url = `/candidates/${candidateId}`;
  return await apiClient.get<ICandidateEdit>(url);
};

export const deleteCandidate = async (primaryKeys: Partial<ICandidatePrimaryKeys>) => {
  const { candidateId } = primaryKeys;
  const url = `/candidates/${candidateId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateCandidate = async (data: Partial<ICandidateEdit>) => {
  const { candidateId, ...rest } = data;
  const url = `/candidates/${candidateId}`;
  return await apiClient.put<MutationResponse<ICandidateEdit>>(url, { candidateId, ...rest });
};

export const addCandidate = async (data: Partial<ICandidateAdd>) => {
  return await apiClient.post<MutationResponse<ICandidateAdd>>('/candidates', data);
};

export const uploadCandidate = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/candidates/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadCandidate = async (data: ICandidatePrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/candidates/upload/${data.candidateId}`, { data });
};

