import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addJobLevel } from '../service';
	import { createJobLevelPayloadValidator } from '../validation';
	import { IJobLevelAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import JOBLEVEL_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import JobLevelForm from '../form/jobLevelCreate';

type CreateJobLevelFormData = z.infer<typeof createJobLevelPayloadValidator>;

const JobLevelCreateDrawer: React.FC = () => {
  const { [JOBLEVEL_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addJobLevelMutation = useMutation({
    mutationFn: addJobLevel,
  });

  const form = useForm<CreateJobLevelFormData>({
    resolver: zodResolver(createJobLevelPayloadValidator),
    defaultValues: getDefaultFormValues(createJobLevelPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateJobLevelFormData) => {
      try {
        await addJobLevelMutation.mutateAsync(data as IJobLevelAdd);
        queryClient.invalidateQueries({ queryKey: [JOBLEVEL_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addJobLevelMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createJobLevelPayloadValidator));
    dispatch(resetSelectedObj(JOBLEVEL_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createJobLevelPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addJobLevelMutation.isSuccess || addJobLevelMutation.isError) {
        addJobLevelMutation.reset();
      }
    };
  }, [addJobLevelMutation]);

  return (
  <Controls title={`Create ${JOBLEVEL_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addJobLevelMutation.isPending}>
    <FormProvider {...form}>
      <JobLevelForm />
    </FormProvider>
  </Controls>
);
};

export default JobLevelCreateDrawer;
