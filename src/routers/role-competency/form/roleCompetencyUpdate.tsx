import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import ROLECOMPETENCY_CONSTANTS from '../constants';
import { updateRoleCompetencyPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';
import { useDesignationOptions } from '../../../option-hooks/useDesignationOptions';
import { useCompetencyOptions } from '../../../option-hooks/useCompetencyOptions';


interface RoleCompetencyFormProps {
}

const RoleCompetencyForm: React.FC<RoleCompetencyFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof updateRoleCompetencyPayloadValidator>>();

const { designations: designation  } = useDesignationOptions();
const { competencies: competency  } = useCompetencyOptions();

	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
<FormField
                    control={form.control}
                    name="designationId"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Designation Id</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Designation Id" />
                                </SelectTrigger>
                                <SelectContent>
                                    {designation?.map((option) => (
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
                    name="competencyId"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Competency Id</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Competency Id" />
                                </SelectTrigger>
                                <SelectContent>
                                    {competency?.map((option) => (
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
                    name="requiredProficiency"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Required Proficiency</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Required Proficiency" />
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

export default RoleCompetencyForm;