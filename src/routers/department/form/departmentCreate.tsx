import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui';
import { z } from 'zod';
import DEPARTMENT_CONSTANTS from '../constants';
import { createDepartmentPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';


interface DepartmentFormProps {
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof createDepartmentPayloadValidator>>();


	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
<FormField
                    control={form.control}
                    name="departmentName"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Department Name</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Department Name"
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

export default DepartmentForm;