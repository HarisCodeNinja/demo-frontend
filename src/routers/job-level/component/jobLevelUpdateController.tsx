import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getJobLevelEditDetails, updateJobLevel } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateJobLevelPayloadValidator } from '../validation';
import { IJobLevelEdit } from '../interface';
import JobLevelUpdateForm from '../form/jobLevelUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import JOBLEVEL_CONSTANTS from '../constants';


const JobLevelUpdateDrawer: React.FC = () => {
  const { [JOBLEVEL_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: jobLevelResponse, isLoading: isLoadingJobLevel } = useQuery({
    queryKey: [JOBLEVEL_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.jobLevelId, showEdit],
    queryFn: () => getJobLevelEditDetails(primaryKeys?.jobLevelId || 0),
    enabled: Boolean(showEdit && primaryKeys?.jobLevelId),
  });


  const updateJobLevelMutation = useMutation({
    mutationFn: updateJobLevel,
  });

  const isLoading = isLoadingJobLevel || updateJobLevelMutation.isPending;
  const form = useForm<z.infer<typeof updateJobLevelPayloadValidator>>({
  resolver: zodResolver(updateJobLevelPayloadValidator),
  defaultValues: getDefaultFormValues(updateJobLevelPayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (jobLevelResponse?.data) {
      form.reset(jobLevelResponse.data);
    }
  }, [jobLevelResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateJobLevelPayloadValidator>) => {
    try {
      await updateJobLevelMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [JOBLEVEL_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateJobLevelMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateJobLevelPayloadValidator));
  dispatch(resetSelectedObj(JOBLEVEL_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${JOBLEVEL_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <JobLevelUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default JobLevelUpdateDrawer;
