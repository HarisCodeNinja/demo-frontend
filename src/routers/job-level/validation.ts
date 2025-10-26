import { z } from "zod";

export const createJobLevelPayloadValidator = z.object({
	levelName: z.string({error: "Level Name is required"}),
	description: z.string().nullish().or(z.literal('')),
});


export const updateJobLevelPayloadValidator = z.object({
	levelName: z.string({error: "Level Name is required"}),
	description: z.string().nullish().or(z.literal('')),
});


