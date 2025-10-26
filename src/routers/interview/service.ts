import { IInterviewAdd, IInterviewEdit, IInterviewPager, IInterviewSingle, IInterviewQueryParams, IInterviewPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getInterviews = async (queryParams: IInterviewQueryParams | null) => {
  const url = `/interviews${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IInterviewPager>(url);
};

export const getSelectInterviews = async (queryParams: IInterviewQueryParams | null) => {
  const url = `/interviews/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getInterviewDetails = async (interviewId: string) => {
  const url = `/interviews/detail/${interviewId}`;
  return await apiClient.get<IInterviewSingle>(url);
};

export const getInterviewEditDetails = async (interviewId: string) => {
  const url = `/interviews/${interviewId}`;
  return await apiClient.get<IInterviewEdit>(url);
};

export const deleteInterview = async (primaryKeys: Partial<IInterviewPrimaryKeys>) => {
  const { interviewId } = primaryKeys;
  const url = `/interviews/${interviewId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateInterview = async (data: Partial<IInterviewEdit>) => {
  const { interviewId, ...rest } = data;
  const url = `/interviews/${interviewId}`;
  return await apiClient.put<MutationResponse<IInterviewEdit>>(url, { interviewId, ...rest });
};

export const addInterview = async (data: Partial<IInterviewAdd>) => {
  return await apiClient.post<MutationResponse<IInterviewAdd>>('/interviews', data);
};

export const uploadInterview = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/interviews/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadInterview = async (data: IInterviewPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/interviews/upload/${data.interviewId}`, { data });
};

