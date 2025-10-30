import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import Controls from '@/components/Wrapper/controls';
import EmployeeUpdateForm from '../form/employeeUpdate';
import { getEmployeeEditDetails, updateEmployee } from '../service';
import { updateEmployeePayloadValidator } from '../validation';
import { IEmployeeEdit } from '../interface';
import EMPLOYEE_CONSTANTS from '../constants';

type UpdateEmployeeFormData = z.infer<typeof updateEmployeePayloadValidator>;

/**
 * Controller component for updating existing employees
 * Manages form state, data fetching, submission, and drawer visibility
 */
const EmployeeUpdateController: React.FC = () => {
	const { [EMPLOYEE_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector(
		(state: RootState) => state.selectedObj
	);
	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();

	const { data: employeeResponse, isLoading: isLoadingEmployee } = useQuery({
		queryKey: [EMPLOYEE_CONSTANTS.QUERY_KEY, 'edit', primaryKeys?.employeeId],
		queryFn: () => getEmployeeEditDetails(primaryKeys?.employeeId || ''),
		enabled: Boolean(showEdit && primaryKeys?.employeeId),
	});

	const updateEmployeeMutation = useMutation({
		mutationFn: updateEmployee,
	});

	const form = useForm<UpdateEmployeeFormData>({
		resolver: zodResolver(updateEmployeePayloadValidator),
		defaultValues: getDefaultFormValues(updateEmployeePayloadValidator),
		mode: 'onChange',
	});

	useEffect(() => {
		if (employeeResponse?.data) {
			form.reset(employeeResponse.data);
		}
	}, [employeeResponse, form]);

	const handleSubmit = useCallback(
		async (data: UpdateEmployeeFormData) => {
			try {
				await updateEmployeeMutation.mutateAsync({ ...data, ...primaryKeys } as IEmployeeEdit);
				queryClient.invalidateQueries({ queryKey: [EMPLOYEE_CONSTANTS.QUERY_KEY], exact: false });
				handleCloseDrawer();
			} catch (error) {
				handleApiFormErrors(error, form);
			}
		},
		[updateEmployeeMutation, primaryKeys, queryClient, form]
	);

	const handleCloseDrawer = useCallback(() => {
		form.reset(getDefaultFormValues(updateEmployeePayloadValidator));
		dispatch(resetSelectedObj(EMPLOYEE_CONSTANTS.ENTITY_KEY));
	}, [form, dispatch]);

	const isLoading = isLoadingEmployee || updateEmployeeMutation.isPending;

	return (
		<Controls
			title={`Edit ${EMPLOYEE_CONSTANTS.ENTITY_NAME}`}
			open={showEdit}
			onClose={handleCloseDrawer}
			form={form}
			onSubmit={handleSubmit}
			type="drawer"
			width={600}
			loading={isLoading}
		>
			<FormProvider {...form}>
				<EmployeeUpdateForm />
			</FormProvider>
		</Controls>
	);
};

export default EmployeeUpdateController;
