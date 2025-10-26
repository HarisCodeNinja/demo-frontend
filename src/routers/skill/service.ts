import { ISkillAdd, ISkillEdit, ISkillPager, ISkillSingle, ISkillQueryParams, ISkillPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getSkills = async (queryParams: ISkillQueryParams | null) => {
  const url = `/skills${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<ISkillPager>(url);
};

export const getSelectSkills = async (queryParams: ISkillQueryParams | null) => {
  const url = `/skills/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getSkillDetails = async (skillId: string) => {
  const url = `/skills/detail/${skillId}`;
  return await apiClient.get<ISkillSingle>(url);
};

export const getSkillEditDetails = async (skillId: string) => {
  const url = `/skills/${skillId}`;
  return await apiClient.get<ISkillEdit>(url);
};

export const deleteSkill = async (primaryKeys: Partial<ISkillPrimaryKeys>) => {
  const { skillId } = primaryKeys;
  const url = `/skills/${skillId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateSkill = async (data: Partial<ISkillEdit>) => {
  const { skillId, ...rest } = data;
  const url = `/skills/${skillId}`;
  return await apiClient.put<MutationResponse<ISkillEdit>>(url, { skillId, ...rest });
};

export const addSkill = async (data: Partial<ISkillAdd>) => {
  return await apiClient.post<MutationResponse<ISkillAdd>>('/skills', data);
};

export const uploadSkill = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/skills/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadSkill = async (data: ISkillPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/skills/upload/${data.skillId}`, { data });
};

