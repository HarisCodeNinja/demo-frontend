import {
	IEmployeeAdd,
	IEmployeeEdit,
	IEmployeePager,
	IEmployeeSingle,
	IEmployeeQueryParams,
	IEmployeePrimaryKeys,
} from './interface';
import { MutationResponse, CommonSelect } from '@/interface/common';
import { CreateQueryParams } from '@/util/PrepareQueryParams';
import apiClient from '@/services/apiClient';

/**
 * Fetches paginated list of employees
 * @param queryParams - Query parameters for filtering, sorting, and pagination
 * @returns Paginated employee data
 */
export const getEmployees = async (queryParams: IEmployeeQueryParams | null) => {
	const url = `/employees${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
	return await apiClient.get<IEmployeePager>(url);
};

/**
 * Fetches employees formatted for select/dropdown components
 * @param queryParams - Optional query parameters
 * @returns Array of select options
 */
export const getSelectEmployees = async (queryParams: IEmployeeQueryParams | null) => {
	const url = `/employees/select${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
	return await apiClient.get<CommonSelect[]>(url);
};

/**
 * Fetches managers formatted for select/dropdown components
 * @param queryParams - Optional query parameters
 * @returns Array of manager select options
 */
export const getSelectManagers = async (queryParams: IEmployeeQueryParams | null) => {
	const url = `/employees/select-managers${queryParams !== null ? '?' + CreateQueryParams(queryParams) : ''}`;
	return await apiClient.get<CommonSelect[]>(url);
};

/**
 * Fetches detailed information for a single employee
 * @param employeeId - The unique identifier of the employee
 * @returns Complete employee details
 */
export const getEmployeeDetails = async (employeeId: string) => {
	const url = `/employees/detail/${employeeId}`;
	return await apiClient.get<IEmployeeSingle>(url);
};

/**
 * Fetches employee data for editing
 * @param employeeId - The unique identifier of the employee
 * @returns Employee data formatted for editing
 */
export const getEmployeeEditDetails = async (employeeId: string) => {
	const url = `/employees/${employeeId}`;
	return await apiClient.get<IEmployeeEdit>(url);
};

/**
 * Deletes an employee record
 * @param primaryKeys - The primary keys identifying the employee to delete
 * @returns Mutation response
 */
export const deleteEmployee = async (primaryKeys: IEmployeePrimaryKeys) => {
	const { employeeId } = primaryKeys;
	if (!employeeId) {
		throw new Error('Employee ID is required for deletion');
	}
	const url = `/employees/${employeeId}`;
	return await apiClient.delete<MutationResponse<unknown>>(url);
};

/**
 * Updates an existing employee record
 * @param data - Employee data to update (must include employeeId)
 * @returns Mutation response with updated employee data
 */
export const updateEmployee = async (data: IEmployeeEdit) => {
	const { employeeId, ...rest } = data;
	if (!employeeId) {
		throw new Error('Employee ID is required for update');
	}
	const url = `/employees/${employeeId}`;
	return await apiClient.put<MutationResponse<IEmployeeEdit>>(url, { employeeId, ...rest });
};

/**
 * Creates a new employee record
 * @param data - New employee data
 * @returns Mutation response with created employee data
 */
export const addEmployee = async (data: IEmployeeAdd) => {
	return await apiClient.post<MutationResponse<IEmployeeAdd>>('/employees', data);
};

/**
 * Uploads a file for an employee (e.g., profile picture, documents)
 * @param data - FormData containing the file and metadata
 * @returns Upload response with file URL
 */
export const uploadEmployee = async (data: FormData) => {
	return await apiClient.put<{ url: string }>('/employees/upload', data, {
		headers: {
			'Content-Type': undefined, // Let axios set the correct Content-Type for FormData
		},
	});
};

/**
 * Deletes an uploaded file for an employee
 * @param data - Employee ID and property name to identify the file
 * @returns Void response
 */
export const deleteUploadEmployee = async (data: IEmployeePrimaryKeys & { property: string }) => {
	return await apiClient.delete<void>(`/employees/upload/${data.employeeId}`, { data });
};
