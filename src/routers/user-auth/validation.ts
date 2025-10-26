import { z } from "zod";

export const registerUserPayloadValidator = z.object({
	email: z.email("Invalid email format"),
	username: z.string({error: "Username is required"}),
	password: z.string({error: "Password is required"}).min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});


export const loginUserPayloadValidator = z.object({
	email: z.email("Invalid email format"),
	password: z.string({error: "Password is required"}).min(1, "Password is required"),
});


export const profileUserPayloadValidator = z.object({
	userId: z.any().optional(),
	email: z.email("Invalid email format"),
	username: z.string({error: "Username is required"}),
	password: z.string(),
	role: z.string({error: "Role is required"}),
	createdAt: z.any().optional(),
	updatedAt: z.any().optional(),
});


export const changePasswordUserPayloadValidator = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string({error: "Password is required"}).min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
	confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});


export const forgotPasswordUserPayloadValidator = z.object({
	email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
});


export const resetPasswordUserPayloadValidator = z.object({
	token: z.string().min(1, "Reset token is required"),
	newPassword: z.string({error: "Password is required"}).min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
	confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});


