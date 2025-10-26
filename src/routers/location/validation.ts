import { z } from "zod";

export const createLocationPayloadValidator = z.object({
	locationName: z.string({error: "Location Name is required"}),
});


export const updateLocationPayloadValidator = z.object({
	locationName: z.string({error: "Location Name is required"}),
});


