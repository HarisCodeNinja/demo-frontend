import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addLearningPlan } from '../service';
import { createLearningPlanPayloadValidator } from '../validation';
import { ILearningPlanAdd } from '../interface';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import LEARNINGPLAN_CONSTANTS from '../constants';

import Controls from '@/components/Wrapper/controls';
import LearningPlanForm from '../form/learningPlanCreate';

type CreateLearningPlanFormData = z.infer<typeof createLearningPlanPayloadValidator>;

const LearningPlanCreateDrawer: React.FC = () => {
  const { [LEARNINGPLAN_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addLearningPlanMutation = useMutation({
    mutationFn: addLearningPlan,
  });

  const form = useForm<CreateLearningPlanFormData>({
    resolver: zodResolver(createLearningPlanPayloadValidator),
    defaultValues: getDefaultFormValues(createLearningPlanPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateLearningPlanFormData) => {
      try {
        await addLearningPlanMutation.mutateAsync(data as ILearningPlanAdd);
        queryClient.invalidateQueries({ queryKey: [LEARNINGPLAN_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addLearningPlanMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createLearningPlanPayloadValidator));
    dispatch(resetSelectedObj(LEARNINGPLAN_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createLearningPlanPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addLearningPlanMutation.isSuccess || addLearningPlanMutation.isError) {
        addLearningPlanMutation.reset();
      }
    };
  }, [addLearningPlanMutation]);

  return (
    <Controls
      title={`Create ${LEARNINGPLAN_CONSTANTS.ENTITY_NAME}`}
      open={showForm}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={handleSubmit}
      type="drawer"
      width={600}
      loading={addLearningPlanMutation.isPending}>
      <FormProvider {...form}>
        <LearningPlanForm />
      </FormProvider>
    </Controls>
  );
};

export default LearningPlanCreateDrawer;
