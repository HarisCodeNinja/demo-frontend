import { z } from "zod";

export const createOfferLetterPayloadValidator = z.object({
	candidateId: z.uuid("Invalid UUID format"),
	jobOpeningId: z.uuid("Invalid UUID format"),
	salaryOffered: z.number({error: "Salary Offered is required"}),
	joiningDate: z.date({error: "Joining Date is required"}),
	termsAndCondition: z.string().nullish().or(z.literal('')),
	status: z.string({error: "Status is required"}),
	approvedBy: z.any().nullish(),
});


export const updateOfferLetterPayloadValidator = z.object({
	candidateId: z.uuid("Invalid UUID format"),
	jobOpeningId: z.uuid("Invalid UUID format"),
	salaryOffered: z.number({error: "Salary Offered is required"}),
	joiningDate: z.date({error: "Joining Date is required"}),
	termsAndCondition: z.string().nullish().or(z.literal('')),
	status: z.string({error: "Status is required"}),
	approvedBy: z.any().nullish(),
});


