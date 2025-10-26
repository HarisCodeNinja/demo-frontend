import { IGoalAdd, IGoalEdit, IGoalPager, IGoalSingle, IGoalQueryParams, IGoalPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getGoals = async (queryParams: IGoalQueryParams | null) => {
  const url = `/goals${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IGoalPager>(url);
};

export const getSelectGoals = async (queryParams: IGoalQueryParams | null) => {
  const url = `/goals/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getGoalDetails = async (goalId: string) => {
  const url = `/goals/detail/${goalId}`;
  return await apiClient.get<IGoalSingle>(url);
};

export const getGoalEditDetails = async (goalId: string) => {
  const url = `/goals/${goalId}`;
  return await apiClient.get<IGoalEdit>(url);
};

export const deleteGoal = async (primaryKeys: Partial<IGoalPrimaryKeys>) => {
  const { goalId } = primaryKeys;
  const url = `/goals/${goalId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateGoal = async (data: Partial<IGoalEdit>) => {
  const { goalId, ...rest } = data;
  const url = `/goals/${goalId}`;
  return await apiClient.put<MutationResponse<IGoalEdit>>(url, { goalId, ...rest });
};

export const addGoal = async (data: Partial<IGoalAdd>) => {
  return await apiClient.post<MutationResponse<IGoalAdd>>('/goals', data);
};

export const uploadGoal = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/goals/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadGoal = async (data: IGoalPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/goals/upload/${data.goalId}`, { data });
};

