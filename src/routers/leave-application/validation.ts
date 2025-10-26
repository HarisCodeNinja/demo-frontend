import { z } from "zod";

export const createLeaveApplicationPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	leaveTypeId: z.uuid("Invalid UUID format"),
	startDate: z.date({error: "Start Date is required"}),
	endDate: z.date({error: "End Date is required"}),
	reason: z.string({error: "Reason is required"}),
	status: z.string({error: "Status is required"}),
	approvedBy: z.any().nullish(),
});


export const updateLeaveApplicationPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	leaveTypeId: z.uuid("Invalid UUID format"),
	startDate: z.date({error: "Start Date is required"}),
	endDate: z.date({error: "End Date is required"}),
	reason: z.string({error: "Reason is required"}),
	status: z.string({error: "Status is required"}),
	approvedBy: z.any().nullish(),
});


