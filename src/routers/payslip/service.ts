import { IPayslipAdd, IPayslipEdit, IPayslipPager, IPayslipSingle, IPayslipQueryParams, IPayslipPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getPayslips = async (queryParams: IPayslipQueryParams | null) => {
  const url = `/payslips${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IPayslipPager>(url);
};

export const getSelectPayslips = async (queryParams: IPayslipQueryParams | null) => {
  const url = `/payslips/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getPayslipDetails = async (payslipId: string) => {
  const url = `/payslips/detail/${payslipId}`;
  return await apiClient.get<IPayslipSingle>(url);
};

export const getPayslipEditDetails = async (payslipId: string) => {
  const url = `/payslips/${payslipId}`;
  return await apiClient.get<IPayslipEdit>(url);
};

export const deletePayslip = async (primaryKeys: Partial<IPayslipPrimaryKeys>) => {
  const { payslipId } = primaryKeys;
  const url = `/payslips/${payslipId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updatePayslip = async (data: Partial<IPayslipEdit>) => {
  const { payslipId, ...rest } = data;
  const url = `/payslips/${payslipId}`;
  return await apiClient.put<MutationResponse<IPayslipEdit>>(url, { payslipId, ...rest });
};

export const addPayslip = async (data: Partial<IPayslipAdd>) => {
  return await apiClient.post<MutationResponse<IPayslipAdd>>('/payslips', data);
};

export const uploadPayslip = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/payslips/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadPayslip = async (data: IPayslipPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/payslips/upload/${data.payslipId}`, { data });
};

