import { z } from "zod";

export const createCompetencyPayloadValidator = z.object({
	competencyName: z.string({error: "Competency Name is required"}),
	description: z.string().nullish().or(z.literal('')),
});


export const updateCompetencyPayloadValidator = z.object({
	competencyName: z.string({error: "Competency Name is required"}),
	description: z.string().nullish().or(z.literal('')),
});


