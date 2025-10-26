import { IJobOpeningAdd, IJobOpeningEdit, IJobOpeningPager, IJobOpeningSingle, IJobOpeningQueryParams, IJobOpeningPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getJobOpenings = async (queryParams: IJobOpeningQueryParams | null) => {
  const url = `/job-openings${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IJobOpeningPager>(url);
};

export const getSelectJobOpenings = async (queryParams: IJobOpeningQueryParams | null) => {
  const url = `/job-openings/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getJobOpeningDetails = async (jobOpeningId: string) => {
  const url = `/job-openings/detail/${jobOpeningId}`;
  return await apiClient.get<IJobOpeningSingle>(url);
};

export const getJobOpeningEditDetails = async (jobOpeningId: string) => {
  const url = `/job-openings/${jobOpeningId}`;
  return await apiClient.get<IJobOpeningEdit>(url);
};

export const deleteJobOpening = async (primaryKeys: Partial<IJobOpeningPrimaryKeys>) => {
  const { jobOpeningId } = primaryKeys;
  const url = `/job-openings/${jobOpeningId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateJobOpening = async (data: Partial<IJobOpeningEdit>) => {
  const { jobOpeningId, ...rest } = data;
  const url = `/job-openings/${jobOpeningId}`;
  return await apiClient.put<MutationResponse<IJobOpeningEdit>>(url, { jobOpeningId, ...rest });
};

export const addJobOpening = async (data: Partial<IJobOpeningAdd>) => {
  return await apiClient.post<MutationResponse<IJobOpeningAdd>>('/job-openings', data);
};

export const uploadJobOpening = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/job-openings/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadJobOpening = async (data: IJobOpeningPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/job-openings/upload/${data.jobOpeningId}`, { data });
};

