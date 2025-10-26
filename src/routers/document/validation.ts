import { z } from "zod";

export const createDocumentPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	documentType: z.string({error: "Document Type is required"}),
	fileName: z.string({error: "File Name is required"}),
	fileUrl: z.url("Invalid URL format"),
});


export const updateDocumentPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	documentType: z.string({error: "Document Type is required"}),
	fileName: z.string({error: "File Name is required"}),
	fileUrl: z.url("Invalid URL format"),
});


