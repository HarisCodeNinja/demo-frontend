import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getDepartmentEditDetails, updateDepartment } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateDepartmentPayloadValidator } from '../validation';
import { IDepartmentEdit } from '../interface';
import DepartmentUpdateForm from '../form/departmentUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import DEPARTMENT_CONSTANTS from '../constants';

const DepartmentUpdateDrawer: React.FC = () => {
  const { [DEPARTMENT_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: departmentResponse, isLoading: isLoadingDepartment } = useQuery({
    queryKey: [DEPARTMENT_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.departmentId, showEdit],
    queryFn: () => getDepartmentEditDetails(primaryKeys?.departmentId || 0),
    enabled: Boolean(showEdit && primaryKeys?.departmentId),
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
  });

  const isLoading = isLoadingDepartment || updateDepartmentMutation.isPending;
  const form = useForm<z.infer<typeof updateDepartmentPayloadValidator>>({
    resolver: zodResolver(updateDepartmentPayloadValidator),
    defaultValues: getDefaultFormValues(updateDepartmentPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (departmentResponse?.data) {
      form.reset(departmentResponse.data);
    }
  }, [departmentResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateDepartmentPayloadValidator>) => {
      try {
        await updateDepartmentMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [DEPARTMENT_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateDepartmentMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateDepartmentPayloadValidator));
    dispatch(resetSelectedObj(DEPARTMENT_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${DEPARTMENT_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <DepartmentUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default DepartmentUpdateDrawer;
