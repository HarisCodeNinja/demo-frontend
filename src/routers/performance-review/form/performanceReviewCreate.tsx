import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import dayjs from 'dayjs';
import { DATE_FORMATE, DATE_TIME_FORMATE } from '@/config/constant';
import { z } from 'zod';
import PERFORMANCEREVIEW_CONSTANTS from '../constants';
import { createPerformanceReviewPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';
import { useEmployeeOptions } from '../../../option-hooks/useEmployeeOptions';


interface PerformanceReviewFormProps {
}

const PerformanceReviewForm: React.FC<PerformanceReviewFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof createPerformanceReviewPayloadValidator>>();

const { employees: employee  } = useEmployeeOptions();
const { employees: reviewer  } = useEmployeeOptions();

	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
<FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Employee Id</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Employee Id" />
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
                    name="reviewerId"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Reviewer Id</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Reviewer Id" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reviewer?.map((option) => (
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
                    name="reviewPeriod"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Review Period</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Review Period"
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
                    name="reviewDate"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Review Date</FormLabel>
                            <FormControl>
                                <Input 
                                    type="date"
                                    placeholder="Select Review Date"
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
                    name="selfAssessment"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Self Assessment</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Enter Self Assessment"
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
                    name="managerFeedback"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Manager Feedback</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Enter Manager Feedback"
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
                    name="overallRating"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Overall Rating</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number"
                                    
                                    placeholder="Enter Overall Rating"
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
                    name="recommendation"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Recommendations</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Enter Recommendations"
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
				<div className="text-sm text-muted-foreground">
					<span className="text-red-500">*</span> Required fields
				</div>
			</div>
		</Form>
	);
};

export default PerformanceReviewForm;