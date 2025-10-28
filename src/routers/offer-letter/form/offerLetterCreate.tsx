import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import { createOfferLetterPayloadValidator } from '../validation';
import { useCandidateOptions } from '../../../option-hooks/useCandidateOptions';
import { useJobOpeningOptions } from '../../../option-hooks/useJobOpeningOptions';
import DatePicker from '@/components/DatePicker';
import { useEmployeeOptions } from '@/option-hooks/useEmployeeOptions';

interface OfferLetterFormProps {}

const OfferLetterForm: React.FC<OfferLetterFormProps> = ({}) => {
  const form = useFormContext<z.infer<typeof createOfferLetterPayloadValidator>>();

  const { candidates: candidate } = useCandidateOptions();
  const { jobOpenings: jobOpening } = useJobOpeningOptions();
  const { employees } = useEmployeeOptions();

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
        <FormField
          control={form.control}
          name="candidateId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Candidate</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidate?.map((option) => (
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
          name="jobOpeningId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Job Opening</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Job Opening" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobOpening?.map((option) => (
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
          name="salaryOffered"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Salary Offered</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter Salary Offered"
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
          name="joiningDate"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Joining Date</FormLabel>
              <FormControl>
                <DatePicker value={fieldProps.value ? new Date(fieldProps.value) : undefined} onChange={(date) => fieldProps.onChange(date?.toISOString() || null)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="termsAndCondition"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Terms And Conditions</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Terms And Conditions" className="resize-none" {...fieldProps} value={fieldProps.value?.toString() || ''} />
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
                    {['Sent', 'Draft'].map((option) => (
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
                    {employees?.map((option) => (
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

export default OfferLetterForm;
