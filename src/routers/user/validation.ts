import { z } from "zod";

export const createUserPayloadValidator = z.object({
	email: z.email("Invalid email format"),
	username: z.string({error: "Username is required"}),
	password: z.string({error: "Password is required"}),
	role: z.string({error: "Role is required"}),
});


export const updateUserPayloadValidator = z.object({
	email: z.email("Invalid email format"),
	username: z.string({error: "Username is required"}),
	role: z.string({error: "Role is required"}),
});


