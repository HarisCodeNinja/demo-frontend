import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import { createInterviewPayloadValidator } from '../validation';
import { useCandidateOptions } from '../../../option-hooks/useCandidateOptions';
import { useJobOpeningOptions } from '../../../option-hooks/useJobOpeningOptions';
import { useEmployeeOptions } from '../../../option-hooks/useEmployeeOptions';
import { DateTimePicker } from '@/components/ui/date-time-picker';

interface InterviewFormProps {}

const InterviewForm: React.FC<InterviewFormProps> = ({}) => {
  const form = useFormContext<z.infer<typeof createInterviewPayloadValidator>>();

  const { candidates: candidate } = useCandidateOptions();
  const { jobOpenings: jobOpening } = useJobOpeningOptions();
  const { employees: interviewer } = useEmployeeOptions();

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
          name="interviewerId"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Interviewer</FormLabel>
              <FormControl>
                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Interviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewer?.map((option) => (
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
          name="interviewDate"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Interview Date</FormLabel>
              <FormControl>
                <DateTimePicker value={fieldProps.value} onChange={fieldProps.onChange} placeholder="Select Interview Date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="feedback"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Feedback</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Feedback" className="resize-none" {...fieldProps} value={fieldProps.value?.toString() || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter Rating"
                  {...fieldProps}
                  value={fieldProps.value?.toString() || ''}
                  onChange={(e) => fieldProps.onChange(parseInt(e.target.value) || 0)}
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
                    {['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'].map((option) => (
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
        <div className="text-sm text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </div>
      </div>
    </Form>
  );
};

export default InterviewForm;
