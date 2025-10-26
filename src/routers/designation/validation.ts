import { z } from "zod";

export const createDesignationPayloadValidator = z.object({
	designationName: z.string({error: "Designation Name is required"}),
});


export const updateDesignationPayloadValidator = z.object({
	designationName: z.string({error: "Designation Name is required"}),
});


