import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addJobOpening } from '../service';
import { createJobOpeningPayloadValidator } from '../validation';
import { IJobOpeningAdd } from '../interface';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import JOBOPENING_CONSTANTS from '../constants';

import Controls from '@/components/Wrapper/controls';
import JobOpeningForm from '../form/jobOpeningCreate';

type CreateJobOpeningFormData = z.infer<typeof createJobOpeningPayloadValidator>;

const JobOpeningCreateDrawer: React.FC = () => {
  const { [JOBOPENING_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addJobOpeningMutation = useMutation({
    mutationFn: addJobOpening,
  });

  const form = useForm<CreateJobOpeningFormData>({
    resolver: zodResolver(createJobOpeningPayloadValidator),
    defaultValues: getDefaultFormValues(createJobOpeningPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateJobOpeningFormData) => {
      try {
        await addJobOpeningMutation.mutateAsync(data as IJobOpeningAdd);
        queryClient.invalidateQueries({ queryKey: [JOBOPENING_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addJobOpeningMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createJobOpeningPayloadValidator));
    dispatch(resetSelectedObj(JOBOPENING_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createJobOpeningPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addJobOpeningMutation.isSuccess || addJobOpeningMutation.isError) {
        addJobOpeningMutation.reset();
      }
    };
  }, [addJobOpeningMutation]);

  return (
    <Controls
      title={`Create ${JOBOPENING_CONSTANTS.ENTITY_NAME}`}
      open={showForm}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={handleSubmit}
      type="drawer"
      width={600}
      loading={addJobOpeningMutation.isPending}>
      <FormProvider {...form}>
        <JobOpeningForm />
      </FormProvider>
    </Controls>
  );
};

export default JobOpeningCreateDrawer;
