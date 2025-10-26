import { z } from "zod";

export const createPayslipPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	payPeriodStart: z.date({error: "Pay Period Start is required"}),
	payPeriodEnd: z.date({error: "Pay Period End is required"}),
	grossSalary: z.number({error: "Gross Salary is required"}),
	netSalary: z.number({error: "Net Salary is required"}),
	deductionsAmount: z.number({error: "Deductions Amount is required"}),
	allowancesAmount: z.number({error: "Allowances Amount is required"}),
	pdfUrl: z.url("Invalid URL format"),
});


export const updatePayslipPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	payPeriodStart: z.date({error: "Pay Period Start is required"}),
	payPeriodEnd: z.date({error: "Pay Period End is required"}),
	grossSalary: z.number({error: "Gross Salary is required"}),
	netSalary: z.number({error: "Net Salary is required"}),
	deductionsAmount: z.number({error: "Deductions Amount is required"}),
	allowancesAmount: z.number({error: "Allowances Amount is required"}),
	pdfUrl: z.url("Invalid URL format"),
});


