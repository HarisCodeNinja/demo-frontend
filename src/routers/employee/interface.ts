import { Pager, QueryPager } from '@/interface/common';


export interface IEmployeePrimaryKeys {
	employeeId: string;
}


export interface IEmployee {
	employeeId: string;
	userId: string;
	firstName: string;
	lastName: string;
	dateOfBirth?: Date;
	gender?: string;
	phoneNumber?: string;
	address?: string;
	personalEmail?: string;
	employmentStartDate: Date;
	employmentEndDate?: Date;
	departmentId: string;
	designationId: string;
	reportingManagerId?: string;
	status: string;
}


export interface IEmployeeAdd extends IEmployee {
}

export interface IEmployeeEdit extends IEmployee {
}

export interface IEmployeeIndex extends IEmployee {
	employeeUniqueId: string;
	createdAt: Date;
	updatedAt: Date;
	employeeLabel: string;
}

export interface IEmployeePager{
	data: IEmployeeIndex[];
	meta: Pager;
}

export interface IEmployeeQueryParams extends QueryPager {}

export interface IEmployeeSingle extends IEmployee {
	employeeUniqueId: string;
	createdAt: Date;
	updatedAt: Date;
}

