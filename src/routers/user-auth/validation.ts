import { z } from 'zod';

/* -------------------------------------------------
   Re-usable password schema 
   ------------------------------------------------- */
const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(8, { error: 'Password must be at least 8 characters' })
  .regex(/[A-Z]/, { error: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { error: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { error: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { error: 'Password must contain at least one special character' });

export const registerUserPayloadValidator = z.object({
  email: z.email({ error: 'Invalid email format' }),
  username: z.string({ error: 'Username is required' }).min(1, { error: 'Username cannot be empty' }),
  password: passwordSchema,
});

export const loginUserPayloadValidator = z.object({
  email: z.email({ error: 'Invalid email format' }),
  password: z.string({ error: 'Password is required' }).min(1, { error: 'Password cannot be empty' }),
});

export const profileUserPayloadValidator = z.object({
  userId: z.string().optional(),
  email: z.email({ error: 'Invalid email format' }),
  username: z.string({ error: 'Username is required' }).min(1, { error: 'Username cannot be empty' }),
  //password: z.string({ error: 'Password is required' }).min(1, { error: 'Password cannot be empty' }),
  role: z.string({ error: 'Role is required' }).min(1, { error: 'Role cannot be empty' }),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

export const changePasswordUserPayloadValidator = z
  .object({
    currentPassword: z.string({ error: 'Current password is required' }).min(1, { error: 'Current password cannot be empty' }),
    newPassword: passwordSchema,
    confirmPassword: z.string({ error: 'Confirm password is required' }).min(1, { error: 'Confirm password cannot be empty' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordUserPayloadValidator = z.object({
  email: z.email({ error: 'Invalid email format' }),
});

export const resetPasswordUserPayloadValidator = z
  .object({
    token: z.string({ error: 'Reset token is required' }).min(1, { error: 'Reset token cannot be empty' }),
    newPassword: passwordSchema,
    confirmPassword: z.string({ error: 'Confirm password is required' }).min(1, { error: 'Confirm password cannot be empty' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });
