import { Pager, QueryPager } from '@/interface/common';


export interface ICompetencyPrimaryKeys {
	competencyId: string;
}


export interface ICompetency {
	competencyId: string;
	competencyName: string;
	description?: string;
}


export interface ICompetencyAdd extends ICompetency {
}

export interface ICompetencyEdit extends ICompetency {
}

export interface ICompetencyIndex extends ICompetency {
	createdAt: Date;
	updatedAt: Date;
	competencyLabel: string;
}

export interface ICompetencyPager{
	data: ICompetencyIndex[];
	meta: Pager;
}

export interface ICompetencyQueryParams extends QueryPager {}

export interface ICompetencySingle extends ICompetency {
	createdAt: Date;
	updatedAt: Date;
}

