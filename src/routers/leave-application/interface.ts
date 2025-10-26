import { Pager, QueryPager } from '@/interface/common';


export interface ILeaveApplicationPrimaryKeys {
	leaveApplicationId: string;
}


export interface ILeaveApplication {
	leaveApplicationId: string;
	employeeId: string;
	leaveTypeId: string;
	startDate: Date;
	endDate: Date;
	reason: string;
	status: string;
	approvedBy?: any;
}


export interface ILeaveApplicationAdd extends ILeaveApplication {
}

export interface ILeaveApplicationEdit extends ILeaveApplication {
}

export interface ILeaveApplicationIndex extends ILeaveApplication {
	numberOfDay: any;
	appliedBy: any;
	createdAt: Date;
	updatedAt: Date;
	leaveApplicationLabel: string;
}

export interface ILeaveApplicationPager{
	data: ILeaveApplicationIndex[];
	meta: Pager;
}

export interface ILeaveApplicationQueryParams extends QueryPager {}

export interface ILeaveApplicationSingle extends ILeaveApplication {
	numberOfDay: any;
	appliedBy: any;
	createdAt: Date;
	updatedAt: Date;
}

