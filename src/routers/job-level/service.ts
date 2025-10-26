import { IJobLevelAdd, IJobLevelEdit, IJobLevelPager, IJobLevelSingle, IJobLevelQueryParams, IJobLevelPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getJobLevels = async (queryParams: IJobLevelQueryParams | null) => {
  const url = `/job-levels${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IJobLevelPager>(url);
};

export const getSelectJobLevels = async (queryParams: IJobLevelQueryParams | null) => {
  const url = `/job-levels/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getJobLevelDetails = async (jobLevelId: string) => {
  const url = `/job-levels/detail/${jobLevelId}`;
  return await apiClient.get<IJobLevelSingle>(url);
};

export const getJobLevelEditDetails = async (jobLevelId: string) => {
  const url = `/job-levels/${jobLevelId}`;
  return await apiClient.get<IJobLevelEdit>(url);
};

export const deleteJobLevel = async (primaryKeys: Partial<IJobLevelPrimaryKeys>) => {
  const { jobLevelId } = primaryKeys;
  const url = `/job-levels/${jobLevelId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateJobLevel = async (data: Partial<IJobLevelEdit>) => {
  const { jobLevelId, ...rest } = data;
  const url = `/job-levels/${jobLevelId}`;
  return await apiClient.put<MutationResponse<IJobLevelEdit>>(url, { jobLevelId, ...rest });
};

export const addJobLevel = async (data: Partial<IJobLevelAdd>) => {
  return await apiClient.post<MutationResponse<IJobLevelAdd>>('/job-levels', data);
};

export const uploadJobLevel = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/job-levels/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadJobLevel = async (data: IJobLevelPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/job-levels/upload/${data.jobLevelId}`, { data });
};

