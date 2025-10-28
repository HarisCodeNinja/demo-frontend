import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addDesignation } from '../service';
import { createDesignationPayloadValidator } from '../validation';
import { IDesignationAdd } from '../interface';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import DESIGNATION_CONSTANTS from '../constants';

import Controls from '@/components/Wrapper/controls';
import DesignationForm from '../form/designationCreate';

type CreateDesignationFormData = z.infer<typeof createDesignationPayloadValidator>;

const DesignationCreateDrawer: React.FC = () => {
  const { [DESIGNATION_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addDesignationMutation = useMutation({
    mutationFn: addDesignation,
  });

  const form = useForm<CreateDesignationFormData>({
    resolver: zodResolver(createDesignationPayloadValidator),
    defaultValues: getDefaultFormValues(createDesignationPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateDesignationFormData) => {
      try {
        await addDesignationMutation.mutateAsync(data as IDesignationAdd);
        queryClient.invalidateQueries({ queryKey: [DESIGNATION_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addDesignationMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createDesignationPayloadValidator));
    dispatch(resetSelectedObj(DESIGNATION_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createDesignationPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addDesignationMutation.isSuccess || addDesignationMutation.isError) {
        addDesignationMutation.reset();
      }
    };
  }, [addDesignationMutation]);

  return (
    <Controls
      title={`Create ${DESIGNATION_CONSTANTS.ENTITY_NAME}`}
      open={showForm}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={handleSubmit}
      type="drawer"
      width={600}
      loading={addDesignationMutation.isPending}>
      <FormProvider {...form}>
        <DesignationForm />
      </FormProvider>
    </Controls>
  );
};

export default DesignationCreateDrawer;
