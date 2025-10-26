import { IJobOpeningSkillAdd, IJobOpeningSkillEdit, IJobOpeningSkillPager, IJobOpeningSkillSingle, IJobOpeningSkillQueryParams, IJobOpeningSkillPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getJobOpeningSkills = async (queryParams: IJobOpeningSkillQueryParams | null) => {
  const url = `/job-opening-skills${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IJobOpeningSkillPager>(url);
};

export const getSelectJobOpeningSkills = async (queryParams: IJobOpeningSkillQueryParams | null) => {
  const url = `/job-opening-skills/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getJobOpeningSkillDetails = async (jobOpeningSkillId: string) => {
  const url = `/job-opening-skills/detail/${jobOpeningSkillId}`;
  return await apiClient.get<IJobOpeningSkillSingle>(url);
};

export const getJobOpeningSkillEditDetails = async (jobOpeningSkillId: string) => {
  const url = `/job-opening-skills/${jobOpeningSkillId}`;
  return await apiClient.get<IJobOpeningSkillEdit>(url);
};

export const deleteJobOpeningSkill = async (primaryKeys: Partial<IJobOpeningSkillPrimaryKeys>) => {
  const { jobOpeningSkillId } = primaryKeys;
  const url = `/job-opening-skills/${jobOpeningSkillId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateJobOpeningSkill = async (data: Partial<IJobOpeningSkillEdit>) => {
  const { jobOpeningSkillId, ...rest } = data;
  const url = `/job-opening-skills/${jobOpeningSkillId}`;
  return await apiClient.put<MutationResponse<IJobOpeningSkillEdit>>(url, { jobOpeningSkillId, ...rest });
};

export const addJobOpeningSkill = async (data: Partial<IJobOpeningSkillAdd>) => {
  return await apiClient.post<MutationResponse<IJobOpeningSkillAdd>>('/job-opening-skills', data);
};

export const uploadJobOpeningSkill = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/job-opening-skills/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadJobOpeningSkill = async (data: IJobOpeningSkillPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/job-opening-skills/upload/${data.jobOpeningSkillId}`, { data });
};

