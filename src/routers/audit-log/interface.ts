import { Pager, QueryPager } from '@/interface/common';


export interface IAuditLogPrimaryKeys {
	auditLogId: string;
}


export interface IAuditLog {
	auditLogId: string;
	userId: string;
	action: string;
	tableName: string;
	recordId: string;
	oldValue?: object;
	newValue?: object;
}


export interface IAuditLogAdd extends IAuditLog {
}

export interface IAuditLogEdit extends IAuditLog {
}

export interface IAuditLogIndex extends IAuditLog {
	ipAddress?: string;
	timestamp: Date;
	createdAt: Date;
	updatedAt: Date;
	auditLogLabel: string;
}

export interface IAuditLogPager{
	data: IAuditLogIndex[];
	meta: Pager;
}

export interface IAuditLogQueryParams extends QueryPager {}

export interface IAuditLogSingle extends IAuditLog {
	ipAddress?: string;
	timestamp: Date;
	createdAt: Date;
	updatedAt: Date;
}

