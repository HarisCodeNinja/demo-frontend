import { IPerformanceReviewAdd, IPerformanceReviewEdit, IPerformanceReviewPager, IPerformanceReviewSingle, IPerformanceReviewQueryParams, IPerformanceReviewPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getPerformanceReviews = async (queryParams: IPerformanceReviewQueryParams | null) => {
  const url = `/performance-reviews${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IPerformanceReviewPager>(url);
};

export const getSelectPerformanceReviews = async (queryParams: IPerformanceReviewQueryParams | null) => {
  const url = `/performance-reviews/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getPerformanceReviewDetails = async (performanceReviewId: string) => {
  const url = `/performance-reviews/detail/${performanceReviewId}`;
  return await apiClient.get<IPerformanceReviewSingle>(url);
};

export const getPerformanceReviewEditDetails = async (performanceReviewId: string) => {
  const url = `/performance-reviews/${performanceReviewId}`;
  return await apiClient.get<IPerformanceReviewEdit>(url);
};

export const deletePerformanceReview = async (primaryKeys: Partial<IPerformanceReviewPrimaryKeys>) => {
  const { performanceReviewId } = primaryKeys;
  const url = `/performance-reviews/${performanceReviewId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updatePerformanceReview = async (data: Partial<IPerformanceReviewEdit>) => {
  const { performanceReviewId, ...rest } = data;
  const url = `/performance-reviews/${performanceReviewId}`;
  return await apiClient.put<MutationResponse<IPerformanceReviewEdit>>(url, { performanceReviewId, ...rest });
};

export const addPerformanceReview = async (data: Partial<IPerformanceReviewAdd>) => {
  return await apiClient.post<MutationResponse<IPerformanceReviewAdd>>('/performance-reviews', data);
};

export const uploadPerformanceReview = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/performance-reviews/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadPerformanceReview = async (data: IPerformanceReviewPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/performance-reviews/upload/${data.performanceReviewId}`, { data });
};

