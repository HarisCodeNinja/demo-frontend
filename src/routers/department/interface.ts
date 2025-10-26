import { Pager, QueryPager } from '@/interface/common';


export interface IDepartmentPrimaryKeys {
	departmentId: string;
}


export interface IDepartment {
	departmentId: string;
	departmentName: string;
}


export interface IDepartmentAdd extends IDepartment {
}

export interface IDepartmentEdit extends IDepartment {
}

export interface IDepartmentIndex extends IDepartment {
	createdAt: Date;
	updatedAt: Date;
	departmentLabel: string;
}

export interface IDepartmentPager{
	data: IDepartmentIndex[];
	meta: Pager;
}

export interface IDepartmentQueryParams extends QueryPager {}

export interface IDepartmentSingle extends IDepartment {
	createdAt: Date;
	updatedAt: Date;
}

