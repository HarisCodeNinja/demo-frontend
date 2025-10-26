import { IOfferLetterAdd, IOfferLetterEdit, IOfferLetterPager, IOfferLetterSingle, IOfferLetterQueryParams, IOfferLetterPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getOfferLetters = async (queryParams: IOfferLetterQueryParams | null) => {
  const url = `/offer-letters${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<IOfferLetterPager>(url);
};

export const getSelectOfferLetters = async (queryParams: IOfferLetterQueryParams | null) => {
  const url = `/offer-letters/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getOfferLetterDetails = async (offerLetterId: string) => {
  const url = `/offer-letters/detail/${offerLetterId}`;
  return await apiClient.get<IOfferLetterSingle>(url);
};

export const getOfferLetterEditDetails = async (offerLetterId: string) => {
  const url = `/offer-letters/${offerLetterId}`;
  return await apiClient.get<IOfferLetterEdit>(url);
};

export const deleteOfferLetter = async (primaryKeys: Partial<IOfferLetterPrimaryKeys>) => {
  const { offerLetterId } = primaryKeys;
  const url = `/offer-letters/${offerLetterId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateOfferLetter = async (data: Partial<IOfferLetterEdit>) => {
  const { offerLetterId, ...rest } = data;
  const url = `/offer-letters/${offerLetterId}`;
  return await apiClient.put<MutationResponse<IOfferLetterEdit>>(url, { offerLetterId, ...rest });
};

export const addOfferLetter = async (data: Partial<IOfferLetterAdd>) => {
  return await apiClient.post<MutationResponse<IOfferLetterAdd>>('/offer-letters', data);
};

export const uploadOfferLetter = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/offer-letters/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadOfferLetter = async (data: IOfferLetterPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/offer-letters/upload/${data.offerLetterId}`, { data });
};

