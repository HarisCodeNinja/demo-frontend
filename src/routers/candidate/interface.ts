import { Pager, QueryPager } from '@/interface/common';


export interface ICandidatePrimaryKeys {
	candidateId: string;
}


export interface ICandidate {
	candidateId: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
	resumeText?: string;
	source?: string;
	currentStatus: string;
	jobOpeningId?: string;
	referredByEmployeeId?: string;
}


export interface ICandidateAdd extends ICandidate {
}

export interface ICandidateEdit extends ICandidate {
}

export interface ICandidateIndex extends ICandidate {
	createdAt: Date;
	updatedAt: Date;
	candidateLabel: string;
}

export interface ICandidatePager{
	data: ICandidateIndex[];
	meta: Pager;
}

export interface ICandidateQueryParams extends QueryPager {}

export interface ICandidateSingle extends ICandidate {
	createdAt: Date;
	updatedAt: Date;
}

