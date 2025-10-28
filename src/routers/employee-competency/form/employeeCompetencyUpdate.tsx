import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import { updateEmployeeCompetencyPayloadValidator } from '../validation';
import { useEmployeeOptions } from '../../../option-hooks/useEmployeeOptions';
import { useCompetencyOptions } from '../../../option-hooks/useCompetencyOptions';
import DatePicker from '@/components/DatePicker';

interface EmployeeCompetencyFormProps {}

const EmployeeCompetencyForm: React.FC<EmployeeCompetencyFormProps> = ({}) => {
  const form = useFormContext<z.infer<typeof updateEmployeeCompetencyPayloadValidator>>();

  const { employees: employee } = useEmployeeOptions();
  const { competencies: competency } = useCompetencyOptions();

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
          name="competencyId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Competency</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Competency" />
                  </SelectTrigger>
                  <SelectContent>
                    {competency?.map((option) => (
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
          name="currentProficiency"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Current Proficiency</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Current Proficiency" />
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
          name="lastEvaluated"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Last Evaluated</FormLabel>
              <FormControl>
                <DatePicker value={fieldProps.value ? new Date(fieldProps.value) : undefined} onChange={fieldProps.onChange} />
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

export default EmployeeCompetencyForm;
