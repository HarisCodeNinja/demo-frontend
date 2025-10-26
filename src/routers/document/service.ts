import { IDocumentAdd, IDocumentEdit, IDocumentPager, IDocumentSingle, IDocumentQueryParams, IDocumentPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getDocuments = async (queryParams: IDocumentQueryParams | null) => {
  const url = `/documents${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IDocumentPager>(url);
};

export const getSelectDocuments = async (queryParams: IDocumentQueryParams | null) => {
  const url = `/documents/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getDocumentDetails = async (documentId: string) => {
  const url = `/documents/detail/${documentId}`;
  return await apiClient.get<IDocumentSingle>(url);
};

export const getDocumentEditDetails = async (documentId: string) => {
  const url = `/documents/${documentId}`;
  return await apiClient.get<IDocumentEdit>(url);
};

export const deleteDocument = async (primaryKeys: Partial<IDocumentPrimaryKeys>) => {
  const { documentId } = primaryKeys;
  const url = `/documents/${documentId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateDocument = async (data: Partial<IDocumentEdit>) => {
  const { documentId, ...rest } = data;
  const url = `/documents/${documentId}`;
  return await apiClient.put<MutationResponse<IDocumentEdit>>(url, { documentId, ...rest });
};

export const addDocument = async (data: Partial<IDocumentAdd>) => {
  return await apiClient.post<MutationResponse<IDocumentAdd>>('/documents', data);
};

export const uploadDocument = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/documents/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadDocument = async (data: IDocumentPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/documents/upload/${data.documentId}`, { data });
};

