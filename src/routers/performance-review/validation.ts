import { z } from "zod";

export const createPerformanceReviewPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	reviewerId: z.uuid("Invalid UUID format"),
	reviewPeriod: z.string({error: "Review Period is required"}),
	reviewDate: z.date({error: "Review Date is required"}),
	selfAssessment: z.string().nullish().or(z.literal('')),
	managerFeedback: z.string().nullish().or(z.literal('')),
	overallRating: z.number().int().nullish(),
	recommendation: z.string().nullish().or(z.literal('')),
	status: z.string({error: "Status is required"}),
});


export const updatePerformanceReviewPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	reviewerId: z.uuid("Invalid UUID format"),
	reviewPeriod: z.string({error: "Review Period is required"}),
	reviewDate: z.date({error: "Review Date is required"}),
	selfAssessment: z.string().nullish().or(z.literal('')),
	managerFeedback: z.string().nullish().or(z.literal('')),
	overallRating: z.number().int().nullish(),
	recommendation: z.string().nullish().or(z.literal('')),
	status: z.string({error: "Status is required"}),
});


