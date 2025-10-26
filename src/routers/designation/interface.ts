import { Pager, QueryPager } from '@/interface/common';


export interface IDesignationPrimaryKeys {
	designationId: string;
}


export interface IDesignation {
	designationId: string;
	designationName: string;
}


export interface IDesignationAdd extends IDesignation {
}

export interface IDesignationEdit extends IDesignation {
}

export interface IDesignationIndex extends IDesignation {
	createdAt: Date;
	updatedAt: Date;
	designationLabel: string;
}

export interface IDesignationPager{
	data: IDesignationIndex[];
	meta: Pager;
}

export interface IDesignationQueryParams extends QueryPager {}

export interface IDesignationSingle extends IDesignation {
	createdAt: Date;
	updatedAt: Date;
}

