import { Pager, QueryPager } from '@/interface/common';


export interface ISkillPrimaryKeys {
	skillId: string;
}


export interface ISkill {
	skillId: string;
	skillName: string;
}


export interface ISkillAdd extends ISkill {
}

export interface ISkillEdit extends ISkill {
}

export interface ISkillIndex extends ISkill {
	createdAt: Date;
	updatedAt: Date;
	skillLabel: string;
}

export interface ISkillPager{
	data: ISkillIndex[];
	meta: Pager;
}

export interface ISkillQueryParams extends QueryPager {}

export interface ISkillSingle extends ISkill {
	createdAt: Date;
	updatedAt: Date;
}

