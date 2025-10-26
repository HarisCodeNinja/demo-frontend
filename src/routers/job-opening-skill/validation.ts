import { z } from "zod";

export const createJobOpeningSkillPayloadValidator = z.object({
	jobOpeningId: z.uuid("Invalid UUID format"),
	skillId: z.uuid("Invalid UUID format"),
	requiredLevel: z.string().nullish(),
});


export const updateJobOpeningSkillPayloadValidator = z.object({
	jobOpeningId: z.uuid("Invalid UUID format"),
	skillId: z.uuid("Invalid UUID format"),
	requiredLevel: z.string().nullish(),
});


