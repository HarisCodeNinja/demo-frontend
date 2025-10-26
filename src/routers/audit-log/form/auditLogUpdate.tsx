import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import AUDITLOG_CONSTANTS from '../constants';
import { updateAuditLogPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';
import { useUserOptions } from '../../../option-hooks/useUserOptions';


interface AuditLogFormProps {
}

const AuditLogForm: React.FC<AuditLogFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof updateAuditLogPayloadValidator>>();

const { users: user  } = useUserOptions();

	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
<FormField
                    control={form.control}
                    name="userId"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>User Id</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select User Id" />
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
                    name="action"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Action</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Action"
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
                    name="tableName"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Table Name</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Table Name"
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
                    name="recordId"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Record Id</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Record Id"
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
                    name="oldValue"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Old Value</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Enter Old Value"
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
                    name="newValue"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>New Value</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Enter New Value"
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
				<div className="text-sm text-muted-foreground">
					<span className="text-red-500">*</span> Required fields
				</div>
			</div>
		</Form>
	);
};

export default AuditLogForm;