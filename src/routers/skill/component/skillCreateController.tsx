import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addSkill } from '../service';
	import { createSkillPayloadValidator } from '../validation';
	import { ISkillAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import SKILL_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import SkillForm from '../form/skillCreate';

type CreateSkillFormData = z.infer<typeof createSkillPayloadValidator>;

const SkillCreateDrawer: React.FC = () => {
  const { [SKILL_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addSkillMutation = useMutation({
    mutationFn: addSkill,
  });

  const form = useForm<CreateSkillFormData>({
    resolver: zodResolver(createSkillPayloadValidator),
    defaultValues: getDefaultFormValues(createSkillPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateSkillFormData) => {
      try {
        await addSkillMutation.mutateAsync(data as ISkillAdd);
        queryClient.invalidateQueries({ queryKey: [SKILL_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addSkillMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createSkillPayloadValidator));
    dispatch(resetSelectedObj(SKILL_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createSkillPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addSkillMutation.isSuccess || addSkillMutation.isError) {
        addSkillMutation.reset();
      }
    };
  }, [addSkillMutation]);

  return (
  <Controls title={`Create ${SKILL_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addSkillMutation.isPending}>
    <FormProvider {...form}>
      <SkillForm />
    </FormProvider>
  </Controls>
);
};

export default SkillCreateDrawer;
