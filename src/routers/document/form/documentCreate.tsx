import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import DOCUMENT_CONSTANTS from '../constants';
import { createDocumentPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';
import { useEmployeeOptions } from '../../../option-hooks/useEmployeeOptions';


interface DocumentFormProps {
}

const DocumentForm: React.FC<DocumentFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof createDocumentPayloadValidator>>();

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
                    name="documentType"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Document Type</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Document Type"
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
                    name="fileName"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>File Name</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter File Name"
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
                    name="fileUrl"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>File Url</FormLabel>
                            <FormControl>
                                <Input 
                                    type="url"
                                    placeholder="Enter File Url"
                                    {...fieldProps}
                                    
                                    value={fieldProps.value?.toString() || ''}
                                />
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

export default DocumentForm;