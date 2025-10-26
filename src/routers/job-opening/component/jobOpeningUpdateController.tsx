import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getJobOpeningEditDetails, updateJobOpening } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateJobOpeningPayloadValidator } from '../validation';
import { IJobOpeningEdit } from '../interface';
import JobOpeningUpdateForm from '../form/jobOpeningUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import JOBOPENING_CONSTANTS from '../constants';


const JobOpeningUpdateDrawer: React.FC = () => {
  const { [JOBOPENING_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: jobOpeningResponse, isLoading: isLoadingJobOpening } = useQuery({
    queryKey: [JOBOPENING_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.jobOpeningId, showEdit],
    queryFn: () => getJobOpeningEditDetails(primaryKeys?.jobOpeningId || 0),
    enabled: Boolean(showEdit && primaryKeys?.jobOpeningId),
  });


  const updateJobOpeningMutation = useMutation({
    mutationFn: updateJobOpening,
  });

  const isLoading = isLoadingJobOpening || updateJobOpeningMutation.isPending;
  const form = useForm<z.infer<typeof updateJobOpeningPayloadValidator>>({
  resolver: zodResolver(updateJobOpeningPayloadValidator),
  defaultValues: getDefaultFormValues(updateJobOpeningPayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (jobOpeningResponse?.data) {
      form.reset(jobOpeningResponse.data);
    }
  }, [jobOpeningResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateJobOpeningPayloadValidator>) => {
    try {
      await updateJobOpeningMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [JOBOPENING_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateJobOpeningMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateJobOpeningPayloadValidator));
  dispatch(resetSelectedObj(JOBOPENING_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${JOBOPENING_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <JobOpeningUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default JobOpeningUpdateDrawer;
