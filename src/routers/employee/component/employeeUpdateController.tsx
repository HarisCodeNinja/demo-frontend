import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getEmployeeEditDetails, updateEmployee } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateEmployeePayloadValidator } from '../validation';
import { IEmployeeEdit } from '../interface';
import EmployeeUpdateForm from '../form/employeeUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import EMPLOYEE_CONSTANTS from '../constants';


const EmployeeUpdateDrawer: React.FC = () => {
  const { [EMPLOYEE_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: employeeResponse, isLoading: isLoadingEmployee } = useQuery({
    queryKey: [EMPLOYEE_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.employeeId, showEdit],
    queryFn: () => getEmployeeEditDetails(primaryKeys?.employeeId || 0),
    enabled: Boolean(showEdit && primaryKeys?.employeeId),
  });


  const updateEmployeeMutation = useMutation({
    mutationFn: updateEmployee,
  });

  const isLoading = isLoadingEmployee || updateEmployeeMutation.isPending;
  const form = useForm<z.infer<typeof updateEmployeePayloadValidator>>({
  resolver: zodResolver(updateEmployeePayloadValidator),
  defaultValues: getDefaultFormValues(updateEmployeePayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (employeeResponse?.data) {
      form.reset(employeeResponse.data);
    }
  }, [employeeResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateEmployeePayloadValidator>) => {
    try {
      await updateEmployeeMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateEmployeeMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateEmployeePayloadValidator));
  dispatch(resetSelectedObj(EMPLOYEE_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${EMPLOYEE_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <EmployeeUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default EmployeeUpdateDrawer;
