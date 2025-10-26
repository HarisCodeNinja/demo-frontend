import { z } from "zod";

export const createLeaveTypePayloadValidator = z.object({
	typeName: z.string({error: "Type Name is required"}),
	maxDaysPerYear: z.number().int({error: "Max Days Per Year is required"}),
	isPaid: z.boolean().refine(val => val === true || val === false, "Must be yes or no"),
});


export const updateLeaveTypePayloadValidator = z.object({
	typeName: z.string({error: "Type Name is required"}),
	maxDaysPerYear: z.number().int({error: "Max Days Per Year is required"}),
	isPaid: z.boolean().refine(val => val === true || val === false, "Must be yes or no"),
});


