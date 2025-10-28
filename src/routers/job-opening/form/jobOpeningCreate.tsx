import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import { createJobOpeningPayloadValidator } from '../validation';
import { useDepartmentOptions } from '../../../option-hooks/useDepartmentOptions';
import { useDesignationOptions } from '../../../option-hooks/useDesignationOptions';
import { useLocationOptions } from '../../../option-hooks/useLocationOptions';
import DatePicker from '@/components/DatePicker';

const JobOpeningForm: React.FC = () => {
  const form = useFormContext<z.infer<typeof createJobOpeningPayloadValidator>>();

  const { departments: department } = useDepartmentOptions();
  const { designations: designation } = useDesignationOptions();
  const { locations: location } = useLocationOptions();

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
        <FormField
          control={form.control}
          name="title"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Title" {...fieldProps} value={fieldProps.value?.toString() || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Description" className="resize-none" {...fieldProps} value={fieldProps.value?.toString() || ''} />
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
                    <SelectValue placeholder="Select Department" />
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
                    <SelectValue placeholder="Select Designation" />
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
          name="locationId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {location?.map((option) => (
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
          name="requiredExperience"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Required Experience</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter Required Experience"
                  {...fieldProps}
                  value={fieldProps.value?.toString() || ''}
                  onChange={(e) => fieldProps.onChange(Number.parseInt(e.target.value) || 0)}
                />
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
                    {[].map((option) => (
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
          name="publishedAt"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Published At</FormLabel>
              <FormControl>
                <DatePicker value={fieldProps.value ? new Date(fieldProps.value) : undefined} onChange={fieldProps.onChange} placeholder="Select Published At" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="closedAt"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Closed At</FormLabel>
              <FormControl>
                <DatePicker value={fieldProps.value ? new Date(fieldProps.value) : undefined} onChange={fieldProps.onChange} placeholder="Select Closed At" />
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

export default JobOpeningForm;
