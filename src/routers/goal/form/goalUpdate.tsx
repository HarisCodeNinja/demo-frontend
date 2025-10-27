import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import dayjs from 'dayjs';
import { DATE_FORMATE, DATE_TIME_FORMATE } from '@/config/constant';
import { z } from 'zod';
import GOAL_CONSTANTS from '../constants';
import { updateGoalPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';
import { useEmployeeOptions } from '../../../option-hooks/useEmployeeOptions';


interface GoalFormProps {
}

const GoalForm: React.FC<GoalFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof updateGoalPayloadValidator>>();

const { employees: employee  } = useEmployeeOptions();

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
                    name="title"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Title"
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
                    name="description"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Enter Description"
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
                    name="kpi"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Kpis</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Enter Kpis"
                                    className="resize-none"
                                    {...fieldProps}
                                    value={fieldProps.value?.toString() || ''}
                                    className="resize-none font-mono" rows={6}
                                />
                            </FormControl>
                            
                            <FormMessage />
                        </FormItem>
                    )}
                />
<FormField
                    control={form.control}
                    name="period"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Period</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Period"
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
                    name="startDate"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <Input 
                                    type="date"
                                    placeholder="Select Start Date"
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
                    name="endDate"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <Input 
                                    type="date"
                                    placeholder="Select End Date"
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
					<span className="text-destructive">*</span> Required fields
				</div>
			</div>
		</Form>
	);
};

export default GoalForm;