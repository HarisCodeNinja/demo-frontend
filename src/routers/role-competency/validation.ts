import { z } from "zod";

export const createRoleCompetencyPayloadValidator = z.object({
	designationId: z.uuid("Invalid UUID format"),
	competencyId: z.uuid("Invalid UUID format"),
	requiredProficiency: z.string().nullish(),
});


export const updateRoleCompetencyPayloadValidator = z.object({
	designationId: z.uuid("Invalid UUID format"),
	competencyId: z.uuid("Invalid UUID format"),
	requiredProficiency: z.string().nullish(),
});


