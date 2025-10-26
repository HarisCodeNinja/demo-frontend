import { Pager, QueryPager } from '@/interface/common';


export interface ILeaveTypePrimaryKeys {
	leaveTypeId: string;
}


export interface ILeaveType {
	leaveTypeId: string;
	typeName: string;
	maxDaysPerYear: number;
	isPaid: boolean;
}


export interface ILeaveTypeAdd extends ILeaveType {
}

export interface ILeaveTypeEdit extends ILeaveType {
}

export interface ILeaveTypeIndex extends ILeaveType {
	createdAt: Date;
	updatedAt: Date;
	leaveTypeLabel: string;
}

export interface ILeaveTypePager{
	data: ILeaveTypeIndex[];
	meta: Pager;
}

export interface ILeaveTypeQueryParams extends QueryPager {}

export interface ILeaveTypeSingle extends ILeaveType {
	createdAt: Date;
	updatedAt: Date;
}

