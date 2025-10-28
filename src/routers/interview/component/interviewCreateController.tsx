import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addInterview } from '../service';
import { createInterviewPayloadValidator } from '../validation';
import { IInterviewAdd } from '../interface';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import INTERVIEW_CONSTANTS from '../constants';

import Controls from '@/components/Wrapper/controls';
import InterviewForm from '../form/interviewCreate';

type CreateInterviewFormData = z.infer<typeof createInterviewPayloadValidator>;

const InterviewCreateDrawer: React.FC = () => {
  const { [INTERVIEW_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addInterviewMutation = useMutation({
    mutationFn: addInterview,
  });

  const form = useForm<CreateInterviewFormData>({
    resolver: zodResolver(createInterviewPayloadValidator),
    defaultValues: getDefaultFormValues(createInterviewPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateInterviewFormData) => {
      try {
        await addInterviewMutation.mutateAsync(data as IInterviewAdd);
        queryClient.invalidateQueries({ queryKey: [INTERVIEW_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addInterviewMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createInterviewPayloadValidator));
    dispatch(resetSelectedObj(INTERVIEW_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createInterviewPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addInterviewMutation.isSuccess || addInterviewMutation.isError) {
        addInterviewMutation.reset();
      }
    };
  }, [addInterviewMutation]);

  return (
    <Controls
      title={`Create ${INTERVIEW_CONSTANTS.ENTITY_NAME}`}
      open={showForm}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={handleSubmit}
      type="drawer"
      width={600}
      loading={addInterviewMutation.isPending}>
      <FormProvider {...form}>
        <InterviewForm />
      </FormProvider>
    </Controls>
  );
};

export default InterviewCreateDrawer;
