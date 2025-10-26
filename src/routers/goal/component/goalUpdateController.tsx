import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getGoalEditDetails, updateGoal } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateGoalPayloadValidator } from '../validation';
import { IGoalEdit } from '../interface';
import GoalUpdateForm from '../form/goalUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import GOAL_CONSTANTS from '../constants';


const GoalUpdateDrawer: React.FC = () => {
  const { [GOAL_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: goalResponse, isLoading: isLoadingGoal } = useQuery({
    queryKey: [GOAL_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.goalId, showEdit],
    queryFn: () => getGoalEditDetails(primaryKeys?.goalId || 0),
    enabled: Boolean(showEdit && primaryKeys?.goalId),
  });


  const updateGoalMutation = useMutation({
    mutationFn: updateGoal,
  });

  const isLoading = isLoadingGoal || updateGoalMutation.isPending;
  const form = useForm<z.infer<typeof updateGoalPayloadValidator>>({
  resolver: zodResolver(updateGoalPayloadValidator),
  defaultValues: getDefaultFormValues(updateGoalPayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (goalResponse?.data) {
      form.reset(goalResponse.data);
    }
  }, [goalResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateGoalPayloadValidator>) => {
    try {
      await updateGoalMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [GOAL_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateGoalMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateGoalPayloadValidator));
  dispatch(resetSelectedObj(GOAL_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${GOAL_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <GoalUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default GoalUpdateDrawer;
