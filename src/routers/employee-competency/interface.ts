import { Pager, QueryPager } from '@/interface/common';


export interface IEmployeeCompetencyPrimaryKeys {
	employeeCompetencyId: string;
}


export interface IEmployeeCompetency {
	employeeCompetencyId: string;
	employeeId: string;
	competencyId: string;
	currentProficiency?: string;
	lastEvaluated?: Date;
}


export interface IEmployeeCompetencyAdd extends IEmployeeCompetency {
}

export interface IEmployeeCompetencyEdit extends IEmployeeCompetency {
}

export interface IEmployeeCompetencyIndex extends IEmployeeCompetency {
	createdAt: Date;
	updatedAt: Date;
	employeeCompetencyLabel: string;
}

export interface IEmployeeCompetencyPager{
	data: IEmployeeCompetencyIndex[];
	meta: Pager;
}

export interface IEmployeeCompetencyQueryParams extends QueryPager {}

export interface IEmployeeCompetencySingle extends IEmployeeCompetency {
	createdAt: Date;
	updatedAt: Date;
}

