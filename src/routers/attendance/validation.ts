import { z } from 'zod';

// Helper to transform empty strings and null to undefined for optional date fields
const optionalDateField = z
  .union([z.date(), z.string(), z.null(), z.undefined()])
  .transform((val) => {
    if (val === null || val === undefined || val === '') {
      return undefined;
    }
    if (typeof val === 'string' && val.trim() === '') {
      return undefined;
    }
    if (val instanceof Date) {
      return val;
    }
    // Try to parse string as date
    const parsed = new Date(val as string);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  })
  .optional();

export const createAttendancePayloadValidator = z
  .object({
    employeeId: z.uuid('Invalid UUID format'),
    attendanceDate: z.date({ error: 'Attendance Date is required' }),
    checkInTime: optionalDateField,
    checkOutTime: optionalDateField,
    status: z.string({ error: 'Status is required' }),
  })
  .refine(
    (data) => {
      if (data.status && data.status !== 'absent') {
        return data.checkInTime instanceof Date;
      }
      return true;
    },
    {
      message: 'Check In Time is required for non-absent status',
      path: ['checkInTime'],
    },
  );

export const updateAttendancePayloadValidator = z
  .object({
    employeeId: z.uuid('Invalid UUID format'),
    attendanceDate: z.date({ error: 'Attendance Date is required' }),
    checkInTime: optionalDateField,
    checkOutTime: optionalDateField,
    status: z.string({ error: 'Status is required' }),
  })
  .refine(
    (data) => {
      if (data.status && data.status !== 'absent') {
        return data.checkInTime instanceof Date;
      }
      return true;
    },
    {
      message: 'Check In Time is required for non-absent status',
      path: ['checkInTime'],
    },
  );
