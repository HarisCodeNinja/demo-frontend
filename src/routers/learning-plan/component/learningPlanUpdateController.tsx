import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getLearningPlanEditDetails, updateLearningPlan } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateLearningPlanPayloadValidator } from '../validation';
import { ILearningPlanEdit } from '../interface';
import LearningPlanUpdateForm from '../form/learningPlanUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import LEARNINGPLAN_CONSTANTS from '../constants';

const LearningPlanUpdateDrawer: React.FC = () => {
  const { [LEARNINGPLAN_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: learningPlanResponse, isLoading: isLoadingLearningPlan } = useQuery({
    queryKey: [LEARNINGPLAN_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.learningPlanId, showEdit],
    queryFn: () => getLearningPlanEditDetails(primaryKeys?.learningPlanId || 0),
    enabled: Boolean(showEdit && primaryKeys?.learningPlanId),
  });

  const updateLearningPlanMutation = useMutation({
    mutationFn: updateLearningPlan,
  });

  const isLoading = isLoadingLearningPlan || updateLearningPlanMutation.isPending;
  const form = useForm<z.infer<typeof updateLearningPlanPayloadValidator>>({
    resolver: zodResolver(updateLearningPlanPayloadValidator),
    defaultValues: getDefaultFormValues(updateLearningPlanPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (learningPlanResponse?.data) {
      form.reset(learningPlanResponse.data);
    }
  }, [learningPlanResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateLearningPlanPayloadValidator>) => {
      try {
        await updateLearningPlanMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [LEARNINGPLAN_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateLearningPlanMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateLearningPlanPayloadValidator));
    dispatch(resetSelectedObj(LEARNINGPLAN_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${LEARNINGPLAN_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <LearningPlanUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default LearningPlanUpdateDrawer;
