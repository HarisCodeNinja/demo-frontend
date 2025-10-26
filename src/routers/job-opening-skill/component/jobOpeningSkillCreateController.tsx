import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addJobOpeningSkill } from '../service';
	import { createJobOpeningSkillPayloadValidator } from '../validation';
	import { IJobOpeningSkillAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import JOBOPENINGSKILL_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import JobOpeningSkillForm from '../form/jobOpeningSkillCreate';

type CreateJobOpeningSkillFormData = z.infer<typeof createJobOpeningSkillPayloadValidator>;

const JobOpeningSkillCreateDrawer: React.FC = () => {
  const { [JOBOPENINGSKILL_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addJobOpeningSkillMutation = useMutation({
    mutationFn: addJobOpeningSkill,
  });

  const form = useForm<CreateJobOpeningSkillFormData>({
    resolver: zodResolver(createJobOpeningSkillPayloadValidator),
    defaultValues: getDefaultFormValues(createJobOpeningSkillPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateJobOpeningSkillFormData) => {
      try {
        await addJobOpeningSkillMutation.mutateAsync(data as IJobOpeningSkillAdd);
        queryClient.invalidateQueries({ queryKey: [JOBOPENINGSKILL_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addJobOpeningSkillMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createJobOpeningSkillPayloadValidator));
    dispatch(resetSelectedObj(JOBOPENINGSKILL_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createJobOpeningSkillPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addJobOpeningSkillMutation.isSuccess || addJobOpeningSkillMutation.isError) {
        addJobOpeningSkillMutation.reset();
      }
    };
  }, [addJobOpeningSkillMutation]);

  return (
  <Controls title={`Create ${JOBOPENINGSKILL_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addJobOpeningSkillMutation.isPending}>
    <FormProvider {...form}>
      <JobOpeningSkillForm />
    </FormProvider>
  </Controls>
);
};

export default JobOpeningSkillCreateDrawer;
