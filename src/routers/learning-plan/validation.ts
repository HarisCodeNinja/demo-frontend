import { z } from "zod";

export const createLearningPlanPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	title: z.string({error: "Title is required"}),
	description: z.string().nullish().or(z.literal('')),
	startDate: z.date({error: "Start Date is required"}),
	endDate: z.date({error: "End Date is required"}),
	status: z.string({error: "Status is required"}),
});


export const updateLearningPlanPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	title: z.string({error: "Title is required"}),
	description: z.string().nullish().or(z.literal('')),
	startDate: z.date({error: "Start Date is required"}),
	endDate: z.date({error: "End Date is required"}),
	status: z.string({error: "Status is required"}),
});


