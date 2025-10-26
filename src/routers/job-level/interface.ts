import { Pager, QueryPager } from '@/interface/common';


export interface IJobLevelPrimaryKeys {
	jobLevelId: string;
}


export interface IJobLevel {
	jobLevelId: string;
	levelName: string;
	description?: string;
}


export interface IJobLevelAdd extends IJobLevel {
}

export interface IJobLevelEdit extends IJobLevel {
}

export interface IJobLevelIndex extends IJobLevel {
	createdAt: Date;
	updatedAt: Date;
	jobLevelLabel: string;
}

export interface IJobLevelPager{
	data: IJobLevelIndex[];
	meta: Pager;
}

export interface IJobLevelQueryParams extends QueryPager {}

export interface IJobLevelSingle extends IJobLevel {
	createdAt: Date;
	updatedAt: Date;
}

