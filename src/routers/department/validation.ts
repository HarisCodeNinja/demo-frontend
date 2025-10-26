import { z } from "zod";

export const createDepartmentPayloadValidator = z.object({
	departmentName: z.string({error: "Department Name is required"}),
});


export const updateDepartmentPayloadValidator = z.object({
	departmentName: z.string({error: "Department Name is required"}),
});


