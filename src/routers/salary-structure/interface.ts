import { Pager, QueryPager } from '@/interface/common';


export interface ISalaryStructurePrimaryKeys {
	salaryStructureId: string;
}


export interface ISalaryStructure {
	salaryStructureId: string;
	employeeId: string;
	basicSalary: number;
	allowance?: object;
	deduction?: object;
	effectiveDate: Date;
	status: string;
}


export interface ISalaryStructureAdd extends ISalaryStructure {
}

export interface ISalaryStructureEdit extends ISalaryStructure {
}

export interface ISalaryStructureIndex extends ISalaryStructure {
	createdAt: Date;
	updatedAt: Date;
	salaryStructureLabel: string;
}

export interface ISalaryStructurePager{
	data: ISalaryStructureIndex[];
	meta: Pager;
}

export interface ISalaryStructureQueryParams extends QueryPager {}

export interface ISalaryStructureSingle extends ISalaryStructure {
	createdAt: Date;
	updatedAt: Date;
}

