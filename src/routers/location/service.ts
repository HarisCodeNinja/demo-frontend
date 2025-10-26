import { ILocationAdd, ILocationEdit, ILocationPager, ILocationSingle, ILocationQueryParams, ILocationPrimaryKeys } from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

export const getLocations = async (queryParams: ILocationQueryParams | null) => {
  const url = `/locations${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<ILocationPager>(url);
};

export const getSelectLocations = async (queryParams: ILocationQueryParams | null) => {
  const url = `/locations/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
  return await apiClient.get<CommonSelect[]>(url);
};

export const getLocationDetails = async (locationId: string) => {
  const url = `/locations/detail/${locationId}`;
  return await apiClient.get<ILocationSingle>(url);
};

export const getLocationEditDetails = async (locationId: string) => {
  const url = `/locations/${locationId}`;
  return await apiClient.get<ILocationEdit>(url);
};

export const deleteLocation = async (primaryKeys: Partial<ILocationPrimaryKeys>) => {
  const { locationId } = primaryKeys;
  const url = `/locations/${locationId}`;
  return await apiClient.delete<MutationResponse<unknown>>(url);
};

export const updateLocation = async (data: Partial<ILocationEdit>) => {
  const { locationId, ...rest } = data;
  const url = `/locations/${locationId}`;
  return await apiClient.put<MutationResponse<ILocationEdit>>(url, { locationId, ...rest });
};

export const addLocation = async (data: Partial<ILocationAdd>) => {
  return await apiClient.post<MutationResponse<ILocationAdd>>('/locations', data);
};

export const uploadLocation = async (data: FormData) => {
  return await apiClient.put<{ url: string }>('/locations/upload', data, {
    headers: {
      'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
    },
  });
};

export const deleteUploadLocation = async (data: ILocationPrimaryKeys & { property: string }) => {
  return await apiClient.delete<void>(`/locations/upload/${data.locationId}`, { data });
};

