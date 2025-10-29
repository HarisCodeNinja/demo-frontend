import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { z } from 'zod';
import { updateAttendancePayloadValidator } from '../validation';
import { useEmployeeOptions } from '../../../option-hooks/useEmployeeOptions';
import DatePicker from '@/components/DatePicker';

const AttendanceForm: React.FC = () => {
  const form = useFormContext<z.infer<typeof updateAttendancePayloadValidator>>();

  const { employees: employee } = useEmployeeOptions();

  const status = form.watch('status');
  const isAbsent = status === 'absent';

  // Clear check-in and check-out times when status changes to absent
  React.useEffect(() => {
    if (isAbsent) {
      form.setValue('checkInTime', null as any);
      form.setValue('checkOutTime', null as any);
    }
  }, [isAbsent, form]);

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employee?.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attendanceDate"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Attendance Date</FormLabel>
              <FormControl>
                <DatePicker value={fieldProps.value} onChange={fieldProps.onChange} placeholder="Select Attendance Date" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Present', 'Absent', 'Half Day', 'Late'].map((option) => (
                      <SelectItem key={option} value={option.toLowerCase()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {!isAbsent && (
          <>
            <FormField
              control={form.control}
              name="checkInTime"
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>Check In Time</FormLabel>
                  <FormControl>
                    <DateTimePicker value={fieldProps.value} onChange={fieldProps.onChange} placeholder="Select Check In Time" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkOutTime"
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>
                    Check Out Time <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker value={fieldProps.value} onChange={fieldProps.onChange} placeholder="Select Check Out Time (Optional)" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <div className="text-sm text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </div>
      </div>
    </Form>
  );
};

export default AttendanceForm;
