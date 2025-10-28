import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addDepartment } from '../service';
import { createDepartmentPayloadValidator } from '../validation';
import { IDepartmentAdd } from '../interface';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import DEPARTMENT_CONSTANTS from '../constants';

import Controls from '@/components/Wrapper/controls';
import DepartmentForm from '../form/departmentCreate';

type CreateDepartmentFormData = z.infer<typeof createDepartmentPayloadValidator>;

const DepartmentCreateDrawer: React.FC = () => {
  const { [DEPARTMENT_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addDepartmentMutation = useMutation({
    mutationFn: addDepartment,
  });

  const form = useForm<CreateDepartmentFormData>({
    resolver: zodResolver(createDepartmentPayloadValidator),
    defaultValues: getDefaultFormValues(createDepartmentPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateDepartmentFormData) => {
      try {
        await addDepartmentMutation.mutateAsync(data as IDepartmentAdd);
        queryClient.invalidateQueries({ queryKey: [DEPARTMENT_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addDepartmentMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createDepartmentPayloadValidator));
    dispatch(resetSelectedObj(DEPARTMENT_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createDepartmentPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addDepartmentMutation.isSuccess || addDepartmentMutation.isError) {
        addDepartmentMutation.reset();
      }
    };
  }, [addDepartmentMutation]);

  return (
    <Controls
      title={`Create ${DEPARTMENT_CONSTANTS.ENTITY_NAME}`}
      open={showForm}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={handleSubmit}
      type="drawer"
      width={600}
      loading={addDepartmentMutation.isPending}>
      <FormProvider {...form}>
        <DepartmentForm />
      </FormProvider>
    </Controls>
  );
};

export default DepartmentCreateDrawer;
