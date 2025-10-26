import { z } from "zod";

export const createCandidatePayloadValidator = z.object({
	firstName: z.string({error: "First Name is required"}),
	lastName: z.string({error: "Last Name is required"}),
	email: z.email("Invalid email format"),
	phoneNumber: z.string().nullish().or(z.literal('')),
	resumeText: z.string().nullish().or(z.literal('')),
	source: z.string().nullish().or(z.literal('')),
	currentStatus: z.string({error: "Current Status is required"}),
	jobOpeningId: z.uuid("Invalid UUID format").nullish(),
	referredByEmployeeId: z.uuid("Invalid UUID format").nullish(),
});


export const updateCandidatePayloadValidator = z.object({
	firstName: z.string({error: "First Name is required"}),
	lastName: z.string({error: "Last Name is required"}),
	email: z.email("Invalid email format"),
	phoneNumber: z.string().nullish().or(z.literal('')),
	resumeText: z.string().nullish().or(z.literal('')),
	source: z.string().nullish().or(z.literal('')),
	currentStatus: z.string({error: "Current Status is required"}),
	jobOpeningId: z.uuid("Invalid UUID format").nullish(),
	referredByEmployeeId: z.uuid("Invalid UUID format").nullish(),
});


