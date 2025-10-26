import { Pager, QueryPager } from '@/interface/common';


export interface IJobOpeningPrimaryKeys {
	jobOpeningId: string;
}


export interface IJobOpening {
	jobOpeningId: string;
	title: string;
	description: string;
	departmentId: string;
	designationId: string;
	locationId: string;
	requiredExperience: number;
	status: string;
	publishedAt?: Date;
	closedAt?: Date;
}


export interface IJobOpeningAdd extends IJobOpening {
}

export interface IJobOpeningEdit extends IJobOpening {
}

export interface IJobOpeningIndex extends IJobOpening {
	createdBy: any;
	createdAt: Date;
	updatedAt: Date;
	jobOpeningLabel: string;
}

export interface IJobOpeningPager{
	data: IJobOpeningIndex[];
	meta: Pager;
}

export interface IJobOpeningQueryParams extends QueryPager {}

export interface IJobOpeningSingle extends IJobOpening {
	createdBy: any;
	createdAt: Date;
	updatedAt: Date;
}

