import { z } from "zod";

export const createGoalPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	title: z.string({error: "Title is required"}),
	description: z.string().nullish().or(z.literal('')),
	kpi: z.any().nullish(),
	period: z.string({error: "Period is required"}),
	startDate: z.date({error: "Start Date is required"}),
	endDate: z.date({error: "End Date is required"}),
	status: z.string({error: "Status is required"}),
});


export const updateGoalPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	title: z.string({error: "Title is required"}),
	description: z.string().nullish().or(z.literal('')),
	kpi: z.any().nullish(),
	period: z.string({error: "Period is required"}),
	startDate: z.date({error: "Start Date is required"}),
	endDate: z.date({error: "End Date is required"}),
	status: z.string({error: "Status is required"}),
});


