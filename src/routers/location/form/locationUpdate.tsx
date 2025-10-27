import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui';
import { z } from 'zod';
import LOCATION_CONSTANTS from '../constants';
import { updateLocationPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';


interface LocationFormProps {
}

const LocationForm: React.FC<LocationFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof updateLocationPayloadValidator>>();


	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
<FormField
                    control={form.control}
                    name="locationName"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Location Name</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text"
                                    placeholder="Enter Location Name"
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

export default LocationForm;