import { Pager, QueryPager } from '@/interface/common';


export interface IRoleCompetencyPrimaryKeys {
	roleCompetencyId: string;
}


export interface IRoleCompetency {
	roleCompetencyId: string;
	designationId: string;
	competencyId: string;
	requiredProficiency?: string;
}


export interface IRoleCompetencyAdd extends IRoleCompetency {
}

export interface IRoleCompetencyEdit extends IRoleCompetency {
}

export interface IRoleCompetencyIndex extends IRoleCompetency {
	createdAt: Date;
	updatedAt: Date;
	roleCompetencyLabel: string;
}

export interface IRoleCompetencyPager{
	data: IRoleCompetencyIndex[];
	meta: Pager;
}

export interface IRoleCompetencyQueryParams extends QueryPager {}

export interface IRoleCompetencySingle extends IRoleCompetency {
	createdAt: Date;
	updatedAt: Date;
}

