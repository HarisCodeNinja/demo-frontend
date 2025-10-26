import { ILearningPlanAdd, ILearningPlanEdit, ILearningPlanPager, ILearningPlanSingle, ILearningPlanQueryParams, ILearningPlanPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getLearningPlans = async (queryParams: ILearningPlanQueryParams | null) => {
  const url = `/learning-plans${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<ILearningPlanPager>(url);
};

export const getSelectLearningPlans = async (queryParams: ILearningPlanQueryParams | null) => {
  const url = `/learning-plans/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getLearningPlanDetails = async (learningPlanId: string) => {
  const url = `/learning-plans/detail/${learningPlanId}`;
  return await apiClient.get<ILearningPlanSingle>(url);
};

export const getLearningPlanEditDetails = async (learningPlanId: string) => {
  const url = `/learning-plans/${learningPlanId}`;
  return await apiClient.get<ILearningPlanEdit>(url);
};

export const deleteLearningPlan = async (primaryKeys: Partial<ILearningPlanPrimaryKeys>) => {
  const { learningPlanId } = primaryKeys;
  const url = `/learning-plans/${learningPlanId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateLearningPlan = async (data: Partial<ILearningPlanEdit>) => {
  const { learningPlanId, ...rest } = data;
  const url = `/learning-plans/${learningPlanId}`;
  return await apiClient.put<MutationResponse<ILearningPlanEdit>>(url, { learningPlanId, ...rest });
};

export const addLearningPlan = async (data: Partial<ILearningPlanAdd>) => {
  return await apiClient.post<MutationResponse<ILearningPlanAdd>>('/learning-plans', data);
};

export const uploadLearningPlan = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/learning-plans/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadLearningPlan = async (data: ILearningPlanPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/learning-plans/upload/${data.learningPlanId}`, { data });
};

