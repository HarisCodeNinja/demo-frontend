import { IAuditLogAdd, IAuditLogEdit, IAuditLogPager, IAuditLogSingle, IAuditLogQueryParams, IAuditLogPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getAuditLogs = async (queryParams: IAuditLogQueryParams | null) => {
  const url = `/audit-logs${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IAuditLogPager>(url);
};

export const getSelectAuditLogs = async (queryParams: IAuditLogQueryParams | null) => {
  const url = `/audit-logs/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getAuditLogDetails = async (auditLogId: string) => {
  const url = `/audit-logs/detail/${auditLogId}`;
  return await apiClient.get<IAuditLogSingle>(url);
};

export const getAuditLogEditDetails = async (auditLogId: string) => {
  const url = `/audit-logs/${auditLogId}`;
  return await apiClient.get<IAuditLogEdit>(url);
};

export const deleteAuditLog = async (primaryKeys: Partial<IAuditLogPrimaryKeys>) => {
  const { auditLogId } = primaryKeys;
  const url = `/audit-logs/${auditLogId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateAuditLog = async (data: Partial<IAuditLogEdit>) => {
  const { auditLogId, ...rest } = data;
  const url = `/audit-logs/${auditLogId}`;
  return await apiClient.put<MutationResponse<IAuditLogEdit>>(url, { auditLogId, ...rest });
};

export const addAuditLog = async (data: Partial<IAuditLogAdd>) => {
  return await apiClient.post<MutationResponse<IAuditLogAdd>>('/audit-logs', data);
};

export const uploadAuditLog = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/audit-logs/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadAuditLog = async (data: IAuditLogPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/audit-logs/upload/${data.auditLogId}`, { data });
};

