import { Pager, QueryPager } from '@/interface/common';


export interface IUserPrimaryKeys {
	userId: string;
}


export interface IUser {
	userId: string;
	email: string;
	username: string;
	password: string;
	role: string;
}


export interface IUserAdd extends IUser {
}

export interface IUserEdit extends IUser {
}

export interface IUserIndex extends IUser {
	createdAt: Date;
	updatedAt: Date;
	userLabel: string;
}

export interface IUserPager{
	data: IUserIndex[];
	meta: Pager;
}

export interface IUserQueryParams extends QueryPager {}

export interface IUserSingle extends IUser {
	createdAt: Date;
	updatedAt: Date;
}

