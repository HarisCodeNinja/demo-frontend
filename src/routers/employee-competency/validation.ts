import { z } from "zod";

export const createEmployeeCompetencyPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	competencyId: z.uuid("Invalid UUID format"),
	currentProficiency: z.string().nullish(),
	lastEvaluated: z.date().nullish(),
});


export const updateEmployeeCompetencyPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	competencyId: z.uuid("Invalid UUID format"),
	currentProficiency: z.string().nullish(),
	lastEvaluated: z.date().nullish(),
});


