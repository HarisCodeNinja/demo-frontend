import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import CANDIDATESKILL_CONSTANTS from '../constants';
import { updateCandidateSkillPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';
import { useCandidateOptions } from '../../../option-hooks/useCandidateOptions';
import { useSkillOptions } from '../../../option-hooks/useSkillOptions';


interface CandidateSkillFormProps {
}

const CandidateSkillForm: React.FC<CandidateSkillFormProps> = ({ }) => {
	const form = useFormContext<z.infer<typeof updateCandidateSkillPayloadValidator>>();

const { candidates: candidate  } = useCandidateOptions();
const { skills: skill  } = useSkillOptions();

	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
<FormField
                    control={form.control}
                    name="candidateId"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Candidate Id</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Candidate Id" />
                                </SelectTrigger>
                                <SelectContent>
                                    {candidate?.map((option) => (
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
                    name="skillId"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Skill Id</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value?.toString() || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Skill Id" />
                                </SelectTrigger>
                                <SelectContent>
                                    {skill?.map((option) => (
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
                    name="proficiency"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Proficiency</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Proficiency" />
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

export default CandidateSkillForm;