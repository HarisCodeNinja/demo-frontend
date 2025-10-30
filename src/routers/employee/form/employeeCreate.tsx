import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import { createEmployeePayloadValidator } from '../validation';
import { useUserOptions } from '@/option-hooks/useUserOptions';
import { useDepartmentOptions } from '@/option-hooks/useDepartmentOptions';
import { useDesignationOptions } from '@/option-hooks/useDesignationOptions';
import { useManagerOptions } from '@/option-hooks/useManagerOptions';
import DatePicker from '@/components/DatePicker';
import EMPLOYEE_CONSTANTS from '../constants';

/**
 * Employee form component for creating and editing employees
 * Can be used in both create and update contexts
 */
const EmployeeForm: React.FC = () => {
	const form = useFormContext<z.infer<typeof createEmployeePayloadValidator>>();

	const { users } = useUserOptions();
	const { departments } = useDepartmentOptions();
	const { designations } = useDesignationOptions();
	const { managers } = useManagerOptions();

	return (
		<Form {...form}>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
				<FormField
					control={form.control}
					name="userId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>User</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select User" />
									</SelectTrigger>
									<SelectContent>
										{users?.map((option) => (
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
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input type="text" placeholder="Enter First Name" {...field} value={field.value?.toString() || ''} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input type="text" placeholder="Enter Last Name" {...field} value={field.value?.toString() || ''} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="dateOfBirth"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Date of Birth</FormLabel>
							<FormControl>
								<DatePicker value={field.value || undefined} onChange={field.onChange} placeholder="Select Date of Birth" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="gender"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Gender</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value || ''}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Gender" />
									</SelectTrigger>
									<SelectContent>
										{EMPLOYEE_CONSTANTS.GENDER_OPTIONS.map((option) => (
											<SelectItem key={option.value} value={option.value}>
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
					name="phoneNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone Number</FormLabel>
							<FormControl>
								<Input type="text" placeholder="Enter Phone Number" {...field} value={field.value?.toString() || ''} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Address</FormLabel>
							<FormControl>
								<Textarea placeholder="Enter Address" className="resize-none" {...field} value={field.value?.toString() || ''} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="personalEmail"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Personal Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="Enter Personal Email" {...field} value={field.value?.toString() || ''} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="employmentStartDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Employment Start Date</FormLabel>
							<FormControl>
								<DatePicker value={field.value || undefined} onChange={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="employmentEndDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Employment End Date</FormLabel>
							<FormControl>
								<DatePicker value={field.value || undefined} onChange={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="departmentId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Department</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Department" />
									</SelectTrigger>
									<SelectContent>
										{departments?.map((option) => (
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
					name="designationId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Designation</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Designation" />
									</SelectTrigger>
									<SelectContent>
										{designations?.map((option) => (
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
					name="reportingManagerId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Reporting Manager</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Reporting Manager" />
									</SelectTrigger>
									<SelectContent>
										{managers?.map((option) => (
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
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value || ''}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Status" />
									</SelectTrigger>
									<SelectContent>
										{EMPLOYEE_CONSTANTS.STATUS_OPTIONS.map((option) => (
											<SelectItem key={option.value} value={option.value}>
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
					<span className="text-destructive">*</span> Required fields
				</div>
			</div>
		</Form>
	);
};

export default EmployeeForm;
