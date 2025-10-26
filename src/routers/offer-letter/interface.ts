import { Pager, QueryPager } from '@/interface/common';


export interface IOfferLetterPrimaryKeys {
	offerLetterId: string;
}


export interface IOfferLetter {
	offerLetterId: string;
	candidateId: string;
	jobOpeningId: string;
	salaryOffered: number;
	joiningDate: Date;
	termsAndCondition?: string;
	status: string;
	approvedBy?: any;
}


export interface IOfferLetterAdd extends IOfferLetter {
}

export interface IOfferLetterEdit extends IOfferLetter {
}

export interface IOfferLetterIndex extends IOfferLetter {
	issuedBy: any;
	createdAt: Date;
	updatedAt: Date;
	offerLetterLabel: string;
}

export interface IOfferLetterPager{
	data: IOfferLetterIndex[];
	meta: Pager;
}

export interface IOfferLetterQueryParams extends QueryPager {}

export interface IOfferLetterSingle extends IOfferLetter {
	issuedBy: any;
	createdAt: Date;
	updatedAt: Date;
}

