import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addGoal } from '../service';
	import { createGoalPayloadValidator } from '../validation';
	import { IGoalAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import GOAL_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import GoalForm from '../form/goalCreate';

type CreateGoalFormData = z.infer<typeof createGoalPayloadValidator>;

const GoalCreateDrawer: React.FC = () => {
  const { [GOAL_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addGoalMutation = useMutation({
    mutationFn: addGoal,
  });

  const form = useForm<CreateGoalFormData>({
    resolver: zodResolver(createGoalPayloadValidator),
    defaultValues: getDefaultFormValues(createGoalPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateGoalFormData) => {
      try {
        await addGoalMutation.mutateAsync(data as IGoalAdd);
        queryClient.invalidateQueries({ queryKey: [GOAL_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addGoalMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createGoalPayloadValidator));
    dispatch(resetSelectedObj(GOAL_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createGoalPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addGoalMutation.isSuccess || addGoalMutation.isError) {
        addGoalMutation.reset();
      }
    };
  }, [addGoalMutation]);

  return (
  <Controls title={`Create ${GOAL_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addGoalMutation.isPending}>
    <FormProvider {...form}>
      <GoalForm />
    </FormProvider>
  </Controls>
);
};

export default GoalCreateDrawer;
