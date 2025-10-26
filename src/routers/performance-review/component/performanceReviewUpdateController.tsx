import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPerformanceReviewEditDetails, updatePerformanceReview } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updatePerformanceReviewPayloadValidator } from '../validation';
import { IPerformanceReviewEdit } from '../interface';
import PerformanceReviewUpdateForm from '../form/performanceReviewUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import PERFORMANCEREVIEW_CONSTANTS from '../constants';


const PerformanceReviewUpdateDrawer: React.FC = () => {
  const { [PERFORMANCEREVIEW_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: performanceReviewResponse, isLoading: isLoadingPerformanceReview } = useQuery({
    queryKey: [PERFORMANCEREVIEW_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.performanceReviewId, showEdit],
    queryFn: () => getPerformanceReviewEditDetails(primaryKeys?.performanceReviewId || 0),
    enabled: Boolean(showEdit && primaryKeys?.performanceReviewId),
  });


  const updatePerformanceReviewMutation = useMutation({
    mutationFn: updatePerformanceReview,
  });

  const isLoading = isLoadingPerformanceReview || updatePerformanceReviewMutation.isPending;
  const form = useForm<z.infer<typeof updatePerformanceReviewPayloadValidator>>({
  resolver: zodResolver(updatePerformanceReviewPayloadValidator),
  defaultValues: getDefaultFormValues(updatePerformanceReviewPayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (performanceReviewResponse?.data) {
      form.reset(performanceReviewResponse.data);
    }
  }, [performanceReviewResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updatePerformanceReviewPayloadValidator>) => {
    try {
      await updatePerformanceReviewMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [PERFORMANCEREVIEW_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updatePerformanceReviewMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updatePerformanceReviewPayloadValidator));
  dispatch(resetSelectedObj(PERFORMANCEREVIEW_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${PERFORMANCEREVIEW_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <PerformanceReviewUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default PerformanceReviewUpdateDrawer;
