import { z } from "zod";

export const createSkillPayloadValidator = z.object({
	skillName: z.string({error: "Skill Name is required"}),
});


export const updateSkillPayloadValidator = z.object({
	skillName: z.string({error: "Skill Name is required"}),
});


