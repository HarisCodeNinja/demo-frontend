import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getEmployeeCompetencyEditDetails, updateEmployeeCompetency } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateEmployeeCompetencyPayloadValidator } from '../validation';
import { IEmployeeCompetencyEdit } from '../interface';
import EmployeeCompetencyUpdateForm from '../form/employeeCompetencyUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import EMPLOYEECOMPETENCY_CONSTANTS from '../constants';

const EmployeeCompetencyUpdateDrawer: React.FC = () => {
  const { [EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: employeeCompetencyResponse, isLoading: isLoadingEmployeeCompetency } = useQuery({
    queryKey: [EMPLOYEECOMPETENCY_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.employeeCompetencyId, showEdit],
    queryFn: () => getEmployeeCompetencyEditDetails(primaryKeys?.employeeCompetencyId || 0),
    enabled: Boolean(showEdit && primaryKeys?.employeeCompetencyId),
  });

  const updateEmployeeCompetencyMutation = useMutation({
    mutationFn: updateEmployeeCompetency,
  });

  const isLoading = isLoadingEmployeeCompetency || updateEmployeeCompetencyMutation.isPending;
  const form = useForm<z.infer<typeof updateEmployeeCompetencyPayloadValidator>>({
    resolver: zodResolver(updateEmployeeCompetencyPayloadValidator),
    defaultValues: getDefaultFormValues(updateEmployeeCompetencyPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (employeeCompetencyResponse?.data) {
      form.reset(employeeCompetencyResponse.data);
    }
  }, [employeeCompetencyResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateEmployeeCompetencyPayloadValidator>) => {
      try {
        await updateEmployeeCompetencyMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [EMPLOYEECOMPETENCY_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateEmployeeCompetencyMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateEmployeeCompetencyPayloadValidator));
    dispatch(resetSelectedObj(EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <EmployeeCompetencyUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default EmployeeCompetencyUpdateDrawer;
