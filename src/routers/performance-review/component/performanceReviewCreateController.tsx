import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addPerformanceReview } from '../service';
	import { createPerformanceReviewPayloadValidator } from '../validation';
	import { IPerformanceReviewAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import PERFORMANCEREVIEW_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import PerformanceReviewForm from '../form/performanceReviewCreate';

type CreatePerformanceReviewFormData = z.infer<typeof createPerformanceReviewPayloadValidator>;

const PerformanceReviewCreateDrawer: React.FC = () => {
  const { [PERFORMANCEREVIEW_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addPerformanceReviewMutation = useMutation({
    mutationFn: addPerformanceReview,
  });

  const form = useForm<CreatePerformanceReviewFormData>({
    resolver: zodResolver(createPerformanceReviewPayloadValidator),
    defaultValues: getDefaultFormValues(createPerformanceReviewPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreatePerformanceReviewFormData) => {
      try {
        await addPerformanceReviewMutation.mutateAsync(data as IPerformanceReviewAdd);
        queryClient.invalidateQueries({ queryKey: [PERFORMANCEREVIEW_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addPerformanceReviewMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createPerformanceReviewPayloadValidator));
    dispatch(resetSelectedObj(PERFORMANCEREVIEW_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createPerformanceReviewPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addPerformanceReviewMutation.isSuccess || addPerformanceReviewMutation.isError) {
        addPerformanceReviewMutation.reset();
      }
    };
  }, [addPerformanceReviewMutation]);

  return (
  <Controls title={`Create ${PERFORMANCEREVIEW_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addPerformanceReviewMutation.isPending}>
    <FormProvider {...form}>
      <PerformanceReviewForm />
    </FormProvider>
  </Controls>
);
};

export default PerformanceReviewCreateDrawer;
