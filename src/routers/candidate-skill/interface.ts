import { Pager, QueryPager } from '@/interface/common';


export interface ICandidateSkillPrimaryKeys {
	candidateSkillId: string;
}


export interface ICandidateSkill {
	candidateSkillId: string;
	candidateId: string;
	skillId: string;
	proficiency?: string;
}


export interface ICandidateSkillAdd extends ICandidateSkill {
}

export interface ICandidateSkillEdit extends ICandidateSkill {
}

export interface ICandidateSkillIndex extends ICandidateSkill {
	createdAt: Date;
	updatedAt: Date;
	candidateSkillLabel: string;
}

export interface ICandidateSkillPager{
	data: ICandidateSkillIndex[];
	meta: Pager;
}

export interface ICandidateSkillQueryParams extends QueryPager {}

export interface ICandidateSkillSingle extends ICandidateSkill {
	createdAt: Date;
	updatedAt: Date;
}

