import { Pager, QueryPager } from '@/interface/common';


export interface IAttendancePrimaryKeys {
	attendanceId: string;
}


export interface IAttendance {
	attendanceId: string;
	employeeId: string;
	attendanceDate: Date;
	checkInTime: Date;
	checkOutTime?: Date;
	status: string;
}


export interface IAttendanceAdd extends IAttendance {
}

export interface IAttendanceEdit extends IAttendance {
}

export interface IAttendanceIndex extends IAttendance {
	totalHour?: any;
	createdAt: Date;
	updatedAt: Date;
	attendanceLabel: string;
}

export interface IAttendancePager{
	data: IAttendanceIndex[];
	meta: Pager;
}

export interface IAttendanceQueryParams extends QueryPager {}

export interface IAttendanceSingle extends IAttendance {
	totalHour?: any;
	createdAt: Date;
	updatedAt: Date;
}

