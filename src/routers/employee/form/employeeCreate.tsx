import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import { createEmployeePayloadValidator } from '../validation';
import { useUserOptions } from '../../../option-hooks/useUserOptions';
import { useDepartmentOptions } from '../../../option-hooks/useDepartmentOptions';
import { useDesignationOptions } from '../../../option-hooks/useDesignationOptions';
import { useManagerOptions } from '@/option-hooks/useManagerOptions';
import DatePicker from '@/components/DatePicker';

const EmployeeForm: React.FC = () => {
  const form = useFormContext<z.infer<typeof createEmployeePayloadValidator>>();

  const { users: user } = useUserOptions();
  const { departments: department } = useDepartmentOptions();
  const { designations: designation } = useDesignationOptions();
  const { managers: reportingManager } = useManagerOptions();

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
        <FormField
          control={form.control}
          name="userId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.map((option) => (
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
          name="firstName"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter First Name" {...fieldProps} value={fieldProps.value?.toString() || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Last Name" {...fieldProps} value={fieldProps.value?.toString() || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Date Of Birth</FormLabel>
              <FormControl>
                <DatePicker value={fieldProps.value || undefined} onChange={fieldProps.onChange} placeholder="Select Date Of Birth" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Male', 'Female'].map((option) => (
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
          name="phoneNumber"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Phone Number" {...fieldProps} value={fieldProps.value?.toString() || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Address" className="resize-none" {...fieldProps} value={fieldProps.value?.toString() || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personalEmail"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Personal Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter Personal Email" {...fieldProps} value={fieldProps.value?.toString() || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="employmentStartDate"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Employment Start Date</FormLabel>
              <FormControl>
                <DatePicker value={fieldProps.value || undefined} onChange={fieldProps.onChange} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="employmentEndDate"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Employment End Date</FormLabel>
              <FormControl>
                <DatePicker value={fieldProps.value || undefined} onChange={fieldProps.onChange} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department Id" />
                  </SelectTrigger>
                  <SelectContent>
                    {department?.map((option) => (
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
          name="designationId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Designation Id" />
                  </SelectTrigger>
                  <SelectContent>
                    {designation?.map((option) => (
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
          name="reportingManagerId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Reporting Manager</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Reporting Manager Id" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportingManager?.map((option) => (
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
                    {['Active', 'Inactive'].map((option) => (
                      <SelectItem key={option} value={option.toLocaleLowerCase()}>
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
        <div className="text-sm text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </div>
      </div>
    </Form>
  );
};

export default EmployeeForm;
