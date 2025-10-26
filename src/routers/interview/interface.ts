import { Pager, QueryPager } from '@/interface/common';


export interface IInterviewPrimaryKeys {
	interviewId: string;
}


export interface IInterview {
	interviewId: string;
	candidateId: string;
	jobOpeningId: string;
	interviewerId: string;
	interviewDate: Date;
	feedback?: string;
	rating?: number;
	status: string;
}


export interface IInterviewAdd extends IInterview {
}

export interface IInterviewEdit extends IInterview {
}

export interface IInterviewIndex extends IInterview {
	createdAt: Date;
	updatedAt: Date;
	interviewLabel: string;
}

export interface IInterviewPager{
	data: IInterviewIndex[];
	meta: Pager;
}

export interface IInterviewQueryParams extends QueryPager {}

export interface IInterviewSingle extends IInterview {
	createdAt: Date;
	updatedAt: Date;
}

