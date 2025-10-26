import { z } from "zod";

export const createCandidateSkillPayloadValidator = z.object({
	candidateId: z.uuid("Invalid UUID format"),
	skillId: z.uuid("Invalid UUID format"),
	proficiency: z.string().nullish(),
});


export const updateCandidateSkillPayloadValidator = z.object({
	candidateId: z.uuid("Invalid UUID format"),
	skillId: z.uuid("Invalid UUID format"),
	proficiency: z.string().nullish(),
});


