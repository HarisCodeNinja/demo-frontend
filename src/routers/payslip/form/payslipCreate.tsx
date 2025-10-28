import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import { createPayslipPayloadValidator } from '../validation';
import { useEmployeeOptions } from '../../../option-hooks/useEmployeeOptions';
import DatePicker from '@/components/DatePicker';

interface PayslipFormProps {}

const PayslipForm: React.FC<PayslipFormProps> = ({}) => {
  const form = useFormContext<z.infer<typeof createPayslipPayloadValidator>>();
  const { employees: employee } = useEmployeeOptions();

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
          name="payPeriodStart"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Pay Period Start</FormLabel>
              <FormControl>
                <DatePicker
                  value={fieldProps.value ? new Date(fieldProps.value) : undefined}
                  onChange={(date) => fieldProps.onChange(date?.toISOString() || null)}
                  placeholder="Select Pay Period Start"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payPeriodEnd"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Pay Period End</FormLabel>
              <FormControl>
                <DatePicker
                  value={fieldProps.value ? new Date(fieldProps.value) : undefined}
                  onChange={(date) => fieldProps.onChange(date?.toISOString() || null)}
                  placeholder="Select Pay Period End"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grossSalary"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Gross Salary</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter Gross Salary"
                  {...fieldProps}
                  value={fieldProps.value?.toString() || ''}
                  onChange={(e) => fieldProps.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="netSalary"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Net Salary</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter Net Salary"
                  {...fieldProps}
                  value={fieldProps.value?.toString() || ''}
                  onChange={(e) => fieldProps.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deductionsAmount"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Deductions Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter Deductions Amount"
                  {...fieldProps}
                  value={fieldProps.value?.toString() || ''}
                  onChange={(e) => fieldProps.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="allowancesAmount"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Allowances Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter Allowances Amount"
                  {...fieldProps}
                  value={fieldProps.value?.toString() || ''}
                  onChange={(e) => fieldProps.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pdfUrl"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Pdf Url</FormLabel>
              <FormControl>
                <Input type="url" placeholder="Enter Pdf Url" {...fieldProps} value={fieldProps.value?.toString() || ''} />
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

export default PayslipForm;
