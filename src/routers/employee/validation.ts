import { z } from 'zod';

const baseEmployeeSchema = z.object({
  userId: z.string({ error: 'User is required' }).uuid('Invalid user ID format'),
  firstName: z.string({ error: 'First name is required' }).min(1, 'First name is required').max(100, 'First name must be less than 100 characters'),
  lastName: z.string({ error: 'Last name is required' }).min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters'),
  dateOfBirth: z.date().optional().nullable(),
  gender: z.string().optional().nullable(),
  phoneNumber: z.string().max(20, 'Phone number must be less than 20 characters').optional().nullable().or(z.literal('')),
  address: z.string().max(500, 'Address must be less than 500 characters').optional().nullable().or(z.literal('')),
  personalEmail: z
    .union([z.email('Invalid email format'), z.literal('')])
    .optional()
    .nullable(),
  employmentStartDate: z.date({ error: 'Employment start date is required' }),
  employmentEndDate: z.date().optional().nullable(),
  departmentId: z.string({ error: 'Department is required' }).uuid('Invalid department ID format'),
  designationId: z.string({ error: 'Designation is required' }).uuid('Invalid designation ID format'),
  reportingManagerId: z.string().uuid('Invalid reporting manager ID format').optional().nullable(),
  status: z.string({ error: 'Status is required' }).min(1, 'Status is required'),
});

export const createEmployeePayloadValidator = baseEmployeeSchema;

export const updateEmployeePayloadValidator = baseEmployeeSchema;
