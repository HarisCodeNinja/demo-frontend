import { Pager, QueryPager } from '@/interface/common';


export interface IDocumentPrimaryKeys {
	documentId: string;
}


export interface IDocument {
	documentId: string;
	employeeId: string;
	documentType: string;
	fileName: string;
	fileUrl: string;
}


export interface IDocumentAdd extends IDocument {
}

export interface IDocumentEdit extends IDocument {
}

export interface IDocumentIndex extends IDocument {
	uploadedBy: any;
	createdAt: Date;
	updatedAt: Date;
	documentLabel: string;
}

export interface IDocumentPager{
	data: IDocumentIndex[];
	meta: Pager;
}

export interface IDocumentQueryParams extends QueryPager {}

export interface IDocumentSingle extends IDocument {
	uploadedBy: any;
	createdAt: Date;
	updatedAt: Date;
}

