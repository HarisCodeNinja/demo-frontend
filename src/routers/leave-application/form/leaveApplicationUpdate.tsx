import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import { updateLeaveApplicationPayloadValidator } from '../validation';
import { useEmployeeOptions } from '../../../option-hooks/useEmployeeOptions';
import { useLeaveTypeOptions } from '../../../option-hooks/useLeaveTypeOptions';
import DatePicker from '@/components/DatePicker';

interface LeaveApplicationFormProps {}

const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({}) => {
  const form = useFormContext<z.infer<typeof updateLeaveApplicationPayloadValidator>>();

  const { employees: employee } = useEmployeeOptions();
  const { leaveTypes: leaveType } = useLeaveTypeOptions();

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
          name="leaveTypeId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Leave Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveType?.map((option) => (
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
          name="startDate"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <DatePicker value={fieldProps.value} onChange={fieldProps.onChange} placeholder="Select Start Date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <DatePicker value={fieldProps.value} onChange={fieldProps.onChange} placeholder="Select End Date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Reason" className="resize-none" {...fieldProps} value={fieldProps.value?.toString() || ''} />
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
                    {['Pending', 'Approved', 'Rejected'].map((option) => (
                      <SelectItem key={option} value={option}>
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
        <FormField
          control={form.control}
          name="approvedBy"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Approved By</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Approved By" />
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
        <div className="text-sm text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </div>
      </div>
    </Form>
  );
};

export default LeaveApplicationForm;
