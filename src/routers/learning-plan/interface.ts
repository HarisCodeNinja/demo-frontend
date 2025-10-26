import { Pager, QueryPager } from '@/interface/common';


export interface ILearningPlanPrimaryKeys {
	learningPlanId: string;
}


export interface ILearningPlan {
	learningPlanId: string;
	employeeId: string;
	title: string;
	description?: string;
	startDate: Date;
	endDate: Date;
	status: string;
}


export interface ILearningPlanAdd extends ILearningPlan {
}

export interface ILearningPlanEdit extends ILearningPlan {
}

export interface ILearningPlanIndex extends ILearningPlan {
	assignedBy: any;
	createdAt: Date;
	updatedAt: Date;
	learningPlanLabel: string;
}

export interface ILearningPlanPager{
	data: ILearningPlanIndex[];
	meta: Pager;
}

export interface ILearningPlanQueryParams extends QueryPager {}

export interface ILearningPlanSingle extends ILearningPlan {
	assignedBy: any;
	createdAt: Date;
	updatedAt: Date;
}

