import { z } from "zod";

export const createJobOpeningPayloadValidator = z.object({
	title: z.string({error: "Title is required"}),
	description: z.string({error: "Description is required"}),
	departmentId: z.uuid("Invalid UUID format"),
	designationId: z.uuid("Invalid UUID format"),
	locationId: z.uuid("Invalid UUID format"),
	requiredExperience: z.number().int({error: "Required Experience is required"}),
	status: z.string({error: "Status is required"}),
	publishedAt: z.date().nullish(),
	closedAt: z.date().nullish(),
});


export const updateJobOpeningPayloadValidator = z.object({
	title: z.string({error: "Title is required"}),
	description: z.string({error: "Description is required"}),
	departmentId: z.uuid("Invalid UUID format"),
	designationId: z.uuid("Invalid UUID format"),
	locationId: z.uuid("Invalid UUID format"),
	requiredExperience: z.number().int({error: "Required Experience is required"}),
	status: z.string({error: "Status is required"}),
	publishedAt: z.date().nullish(),
	closedAt: z.date().nullish(),
});


