import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import LEAVETYPE_CONSTANTS from '../constants';
import { updateLeaveTypePayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';


interface LeaveTypeFormProps {
}

const LeaveTypeForm: React.FC<LeaveTypeFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof updateLeaveTypePayloadValidator>>();


	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
<FormField
                    control={form.control}
                    name="typeName"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Type Name</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Type Name"
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
                    name="maxDaysPerYear"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Max Days Per Year</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number"
                                    
                                    placeholder="Enter Max Days Per Year"
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
                    name="isPaid"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Is Paid</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Yes/No" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[{"value":"true","label":"Yes"},{"value":"false","label":"No"}].map((option) => (
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

export default LeaveTypeForm;