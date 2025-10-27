import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui';
import { z } from 'zod';
import DESIGNATION_CONSTANTS from '../constants';
import { updateDesignationPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';


interface DesignationFormProps {
}

const DesignationForm: React.FC<DesignationFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof updateDesignationPayloadValidator>>();


	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
<FormField
                    control={form.control}
                    name="designationName"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Designation Name</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Designation Name"
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

export default DesignationForm;