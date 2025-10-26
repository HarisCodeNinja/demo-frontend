import { z } from "zod";

export const createInterviewPayloadValidator = z.object({
	candidateId: z.uuid("Invalid UUID format"),
	jobOpeningId: z.uuid("Invalid UUID format"),
	interviewerId: z.uuid("Invalid UUID format"),
	interviewDate: z.date({error: "Interview Date is required"}),
	feedback: z.string().nullish().or(z.literal('')),
	rating: z.number().int().nullish(),
	status: z.string({error: "Status is required"}),
});


export const updateInterviewPayloadValidator = z.object({
	candidateId: z.uuid("Invalid UUID format"),
	jobOpeningId: z.uuid("Invalid UUID format"),
	interviewerId: z.uuid("Invalid UUID format"),
	interviewDate: z.date({error: "Interview Date is required"}),
	feedback: z.string().nullish().or(z.literal('')),
	rating: z.number().int().nullish(),
	status: z.string({error: "Status is required"}),
});


