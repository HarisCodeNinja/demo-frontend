import { Pager, QueryPager } from '@/interface/common';


export interface IPerformanceReviewPrimaryKeys {
	performanceReviewId: string;
}


export interface IPerformanceReview {
	performanceReviewId: string;
	employeeId: string;
	reviewerId: string;
	reviewPeriod: string;
	reviewDate: Date;
	selfAssessment?: string;
	managerFeedback?: string;
	overallRating?: number;
	recommendation?: string;
	status: string;
}


export interface IPerformanceReviewAdd extends IPerformanceReview {
}

export interface IPerformanceReviewEdit extends IPerformanceReview {
}

export interface IPerformanceReviewIndex extends IPerformanceReview {
	createdAt: Date;
	updatedAt: Date;
	performanceReviewLabel: string;
}

export interface IPerformanceReviewPager{
	data: IPerformanceReviewIndex[];
	meta: Pager;
}

export interface IPerformanceReviewQueryParams extends QueryPager {}

export interface IPerformanceReviewSingle extends IPerformanceReview {
	createdAt: Date;
	updatedAt: Date;
}

