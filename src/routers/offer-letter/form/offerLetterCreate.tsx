import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import dayjs from 'dayjs';
import { DATE_FORMATE, DATE_TIME_FORMATE } from '@/config/constant';
import { z } from 'zod';
import OFFERLETTER_CONSTANTS from '../constants';
import { createOfferLetterPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';
import { useCandidateOptions } from '../../../option-hooks/useCandidateOptions';
import { useJobOpeningOptions } from '../../../option-hooks/useJobOpeningOptions';


interface OfferLetterFormProps {
}

const OfferLetterForm: React.FC<OfferLetterFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof createOfferLetterPayloadValidator>>();

const { candidates: candidate  } = useCandidateOptions();
const { jobOpenings: jobOpening  } = useJobOpeningOptions();

	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
<FormField
                    control={form.control}
                    name="candidateId"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Candidate Id</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Candidate Id" />
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
                            <FormLabel>Job Opening Id</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Job Opening Id" />
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
                                <Input 
                                    type="date"
                                    placeholder="Select Joining Date"
                                    {...fieldProps}
                                    value={fieldProps.value ? dayjs(fieldProps.value).format('YYYY-MM-DD') : ''}
                                    onChange={(e) => fieldProps.onChange(e.target.value ? dayjs(e.target.value).toISOString() : null)}
                                />
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
                                <Textarea 
                                    placeholder="Enter Terms And Conditions"
                                    className="resize-none"
                                    {...fieldProps}
                                    value={fieldProps.value?.toString() || ''}
                                    
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
                    name="approvedBy"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Approved By Id</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Approved By Id" />
                                </SelectTrigger>
                                <SelectContent>
                                    {approvedby?.map((option) => (
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
					<span className="text-red-500">*</span> Required fields
				</div>
			</div>
		</Form>
	);
};

export default OfferLetterForm;