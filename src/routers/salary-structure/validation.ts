import { z } from "zod";

export const createSalaryStructurePayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	basicSalary: z.number({error: "Basic Salary is required"}),
	allowance: z.any().nullish(),
	deduction: z.any().nullish(),
	effectiveDate: z.date({error: "Effective Date is required"}),
	status: z.string({error: "Status is required"}),
});


export const updateSalaryStructurePayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	basicSalary: z.number({error: "Basic Salary is required"}),
	allowance: z.any().nullish(),
	deduction: z.any().nullish(),
	effectiveDate: z.date({error: "Effective Date is required"}),
	status: z.string({error: "Status is required"}),
});


