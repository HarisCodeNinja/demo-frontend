import { Pager, QueryPager } from '@/interface/common';


export interface ILocationPrimaryKeys {
	locationId: string;
}


export interface ILocation {
	locationId: string;
	locationName: string;
}


export interface ILocationAdd extends ILocation {
}

export interface ILocationEdit extends ILocation {
}

export interface ILocationIndex extends ILocation {
	createdAt: Date;
	updatedAt: Date;
	locationLabel: string;
}

export interface ILocationPager{
	data: ILocationIndex[];
	meta: Pager;
}

export interface ILocationQueryParams extends QueryPager {}

export interface ILocationSingle extends ILocation {
	createdAt: Date;
	updatedAt: Date;
}

