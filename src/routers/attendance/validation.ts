import { z } from "zod";

export const createAttendancePayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	attendanceDate: z.date({error: "Attendance Date is required"}),
	checkInTime: z.date({error: "Check In Time is required"}),
	checkOutTime: z.date().nullish(),
	status: z.string({error: "Status is required"}),
});


export const updateAttendancePayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	attendanceDate: z.date({error: "Attendance Date is required"}),
	checkInTime: z.date({error: "Check In Time is required"}),
	checkOutTime: z.date().nullish(),
	status: z.string({error: "Status is required"}),
});


