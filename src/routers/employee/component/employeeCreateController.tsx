import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import Controls from '@/components/Wrapper/controls';
import EmployeeForm from '../form/employeeCreate';
import { addEmployee } from '../service';
import { createEmployeePayloadValidator } from '../validation';
import { IEmployeeAdd } from '../interface';
import EMPLOYEE_CONSTANTS from '../constants';

type CreateEmployeeFormData = z.infer<typeof createEmployeePayloadValidator>;

/**
 * Controller component for creating new employees
 * Manages form state, submission, and drawer visibility
 */
const EmployeeCreateController: React.FC = () => {
	const { [EMPLOYEE_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector(
		(state: RootState) => state.selectedObj
	);
	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();

	const addEmployeeMutation = useMutation({
		mutationFn: addEmployee,
	});

	const form = useForm<CreateEmployeeFormData>({
		resolver: zodResolver(createEmployeePayloadValidator),
		defaultValues: getDefaultFormValues(createEmployeePayloadValidator),
		mode: 'onChange',
	});

	const handleSubmit = useCallback(
		async (data: CreateEmployeeFormData) => {
			try {
				await addEmployeeMutation.mutateAsync(data as IEmployeeAdd);
				queryClient.invalidateQueries({ queryKey: [EMPLOYEE_CONSTANTS.QUERY_KEY], exact: false });
				handleCloseDrawer();
			} catch (error) {
				handleApiFormErrors(error, form);
			}
		},
		[addEmployeeMutation, queryClient, form]
	);

	const handleCloseDrawer = useCallback(() => {
		form.reset(getDefaultFormValues(createEmployeePayloadValidator));
		dispatch(resetSelectedObj(EMPLOYEE_CONSTANTS.ENTITY_KEY));
	}, [form, dispatch]);

	useEffect(() => {
		if (showForm) {
			form.reset(getDefaultFormValues(createEmployeePayloadValidator));
		}
	}, [showForm, form]);

	useEffect(() => {
		return () => {
			if (addEmployeeMutation.isSuccess || addEmployeeMutation.isError) {
				addEmployeeMutation.reset();
			}
		};
	}, [addEmployeeMutation]);

	return (
		<Controls
			title={`Create ${EMPLOYEE_CONSTANTS.ENTITY_NAME}`}
			open={showForm}
			onClose={handleCloseDrawer}
			form={form}
			onSubmit={handleSubmit}
			type="drawer"
			width={600}
			loading={addEmployeeMutation.isPending}
		>
			<FormProvider {...form}>
				<EmployeeForm />
			</FormProvider>
		</Controls>
	);
};

export default EmployeeCreateController;
