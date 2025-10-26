import { ICandidateSkillAdd, ICandidateSkillEdit, ICandidateSkillPager, ICandidateSkillSingle, ICandidateSkillQueryParams, ICandidateSkillPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getCandidateSkills = async (queryParams: ICandidateSkillQueryParams | null) => {
  const url = `/candidate-skills${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<ICandidateSkillPager>(url);
};

export const getSelectCandidateSkills = async (queryParams: ICandidateSkillQueryParams | null) => {
  const url = `/candidate-skills/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getCandidateSkillDetails = async (candidateSkillId: string) => {
  const url = `/candidate-skills/detail/${candidateSkillId}`;
  return await apiClient.get<ICandidateSkillSingle>(url);
};

export const getCandidateSkillEditDetails = async (candidateSkillId: string) => {
  const url = `/candidate-skills/${candidateSkillId}`;
  return await apiClient.get<ICandidateSkillEdit>(url);
};

export const deleteCandidateSkill = async (primaryKeys: Partial<ICandidateSkillPrimaryKeys>) => {
  const { candidateSkillId } = primaryKeys;
  const url = `/candidate-skills/${candidateSkillId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateCandidateSkill = async (data: Partial<ICandidateSkillEdit>) => {
  const { candidateSkillId, ...rest } = data;
  const url = `/candidate-skills/${candidateSkillId}`;
  return await apiClient.put<MutationResponse<ICandidateSkillEdit>>(url, { candidateSkillId, ...rest });
};

export const addCandidateSkill = async (data: Partial<ICandidateSkillAdd>) => {
  return await apiClient.post<MutationResponse<ICandidateSkillAdd>>('/candidate-skills', data);
};

export const uploadCandidateSkill = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/candidate-skills/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadCandidateSkill = async (data: ICandidateSkillPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/candidate-skills/upload/${data.candidateSkillId}`, { data });
};

