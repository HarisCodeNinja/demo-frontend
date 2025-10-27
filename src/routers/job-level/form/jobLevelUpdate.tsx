import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Textarea } from '@/components/ui';
import { z } from 'zod';
import JOBLEVEL_CONSTANTS from '../constants';
import { updateJobLevelPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';


interface JobLevelFormProps {
}

const JobLevelForm: React.FC<JobLevelFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof updateJobLevelPayloadValidator>>();


	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
<FormField
                    control={form.control}
                    name="levelName"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Level Name</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Level Name"
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
				<div className="text-sm text-muted-foreground">
					<span className="text-destructive">*</span> Required fields
				</div>
			</div>
		</Form>
	);
};

export default JobLevelForm;