import { Pager, QueryPager } from '@/interface/common';


export interface IJobOpeningSkillPrimaryKeys {
	jobOpeningSkillId: string;
}


export interface IJobOpeningSkill {
	jobOpeningSkillId: string;
	jobOpeningId: string;
	skillId: string;
	requiredLevel?: string;
}


export interface IJobOpeningSkillAdd extends IJobOpeningSkill {
}

export interface IJobOpeningSkillEdit extends IJobOpeningSkill {
}

export interface IJobOpeningSkillIndex extends IJobOpeningSkill {
	createdAt: Date;
	updatedAt: Date;
	jobOpeningSkillLabel: string;
}

export interface IJobOpeningSkillPager{
	data: IJobOpeningSkillIndex[];
	meta: Pager;
}

export interface IJobOpeningSkillQueryParams extends QueryPager {}

export interface IJobOpeningSkillSingle extends IJobOpeningSkill {
	createdAt: Date;
	updatedAt: Date;
}

