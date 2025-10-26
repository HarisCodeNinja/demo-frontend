import { Pager, QueryPager } from '@/interface/common';


export interface IGoalPrimaryKeys {
	goalId: string;
}


export interface IGoal {
	goalId: string;
	employeeId: string;
	title: string;
	description?: string;
	kpi?: object;
	period: string;
	startDate: Date;
	endDate: Date;
	status: string;
}


export interface IGoalAdd extends IGoal {
}

export interface IGoalEdit extends IGoal {
}

export interface IGoalIndex extends IGoal {
	assignedBy: any;
	createdAt: Date;
	updatedAt: Date;
	goalLabel: string;
}

export interface IGoalPager{
	data: IGoalIndex[];
	meta: Pager;
}

export interface IGoalQueryParams extends QueryPager {}

export interface IGoalSingle extends IGoal {
	assignedBy: any;
	createdAt: Date;
	updatedAt: Date;
}

