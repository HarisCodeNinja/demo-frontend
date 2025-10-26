import { Pager, QueryPager } from '@/interface/common';


export interface IPayslipPrimaryKeys {
	payslipId: string;
}


export interface IPayslip {
	payslipId: string;
	employeeId: string;
	payPeriodStart: Date;
	payPeriodEnd: Date;
	grossSalary: number;
	netSalary: number;
	deductionsAmount: number;
	allowancesAmount: number;
	pdfUrl: string;
}


export interface IPayslipAdd extends IPayslip {
}

export interface IPayslipEdit extends IPayslip {
}

export interface IPayslipIndex extends IPayslip {
	generatedBy: any;
	createdAt: Date;
	updatedAt: Date;
	payslipLabel: string;
}

export interface IPayslipPager{
	data: IPayslipIndex[];
	meta: Pager;
}

export interface IPayslipQueryParams extends QueryPager {}

export interface IPayslipSingle extends IPayslip {
	generatedBy: any;
	createdAt: Date;
	updatedAt: Date;
}

