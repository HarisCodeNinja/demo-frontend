import { z } from "zod";

export const createAuditLogPayloadValidator = z.object({
	userId: z.uuid("Invalid UUID format"),
	action: z.string({error: "Action is required"}),
	tableName: z.string({error: "Table Name is required"}),
	recordId: z.string({error: "Record Id is required"}),
	oldValue: z.any().nullish(),
	newValue: z.any().nullish(),
});


export const updateAuditLogPayloadValidator = z.object({
	userId: z.uuid("Invalid UUID format"),
	action: z.string({error: "Action is required"}),
	tableName: z.string({error: "Table Name is required"}),
	recordId: z.string({error: "Record Id is required"}),
	oldValue: z.any().nullish(),
	newValue: z.any().nullish(),
});


