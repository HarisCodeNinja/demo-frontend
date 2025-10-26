import { z } from "zod";

export const createEmployeePayloadValidator = z.object({
	userId: z.uuid("Invalid UUID format"),
	firstName: z.string({error: "First Name is required"}),
	lastName: z.string({error: "Last Name is required"}),
	dateOfBirth: z.date().nullish(),
	gender: z.string().nullish(),
	phoneNumber: z.string().nullish().or(z.literal('')),
	address: z.string().nullish().or(z.literal('')),
	personalEmail: z.email("Invalid email format").nullish().or(z.literal('')),
	employmentStartDate: z.date({error: "Employment Start Date is required"}),
	employmentEndDate: z.date().nullish(),
	departmentId: z.uuid("Invalid UUID format"),
	designationId: z.uuid("Invalid UUID format"),
	reportingManagerId: z.uuid("Invalid UUID format").nullish(),
	status: z.string({error: "Status is required"}),
});


export const updateEmployeePayloadValidator = z.object({
	userId: z.uuid("Invalid UUID format"),
	firstName: z.string({error: "First Name is required"}),
	lastName: z.string({error: "Last Name is required"}),
	dateOfBirth: z.date().nullish(),
	gender: z.string().nullish(),
	phoneNumber: z.string().nullish().or(z.literal('')),
	address: z.string().nullish().or(z.literal('')),
	personalEmail: z.email("Invalid email format").nullish().or(z.literal('')),
	employmentStartDate: z.date({error: "Employment Start Date is required"}),
	employmentEndDate: z.date().nullish(),
	departmentId: z.uuid("Invalid UUID format"),
	designationId: z.uuid("Invalid UUID format"),
	reportingManagerId: z.uuid("Invalid UUID format").nullish(),
	status: z.string({error: "Status is required"}),
});


