import { IEmployeeAdd } from '../interface';

/**
 * Default values for employee form
 * Aligned with validation schema requirements
 */
export const defaultEmployeeObject: Partial<IEmployeeAdd> = {
	userId: undefined,
	firstName: '',
	lastName: '',
	dateOfBirth: undefined,
	gender: undefined,
	phoneNumber: '',
	address: '',
	personalEmail: '',
	employmentStartDate: undefined,
	employmentEndDate: undefined,
	departmentId: undefined,
	designationId: undefined,
	reportingManagerId: undefined,
	status: 'active',
};

export default defaultEmployeeObject;