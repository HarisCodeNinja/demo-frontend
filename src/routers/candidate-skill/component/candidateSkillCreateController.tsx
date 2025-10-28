import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addCandidateSkill } from '../service';
import { createCandidateSkillPayloadValidator } from '../validation';
import { ICandidateSkillAdd } from '../interface';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import CANDIDATESKILL_CONSTANTS from '../constants';

import Controls from '@/components/Wrapper/controls';
import CandidateSkillForm from '../form/candidateSkillCreate';

type CreateCandidateSkillFormData = z.infer<typeof createCandidateSkillPayloadValidator>;

const CandidateSkillCreateDrawer: React.FC = () => {
  const { [CANDIDATESKILL_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addCandidateSkillMutation = useMutation({
    mutationFn: addCandidateSkill,
  });

  const form = useForm<CreateCandidateSkillFormData>({
    resolver: zodResolver(createCandidateSkillPayloadValidator),
    defaultValues: getDefaultFormValues(createCandidateSkillPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateCandidateSkillFormData) => {
      try {
        await addCandidateSkillMutation.mutateAsync(data as ICandidateSkillAdd);
        queryClient.invalidateQueries({ queryKey: [CANDIDATESKILL_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addCandidateSkillMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createCandidateSkillPayloadValidator));
    dispatch(resetSelectedObj(CANDIDATESKILL_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createCandidateSkillPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addCandidateSkillMutation.isSuccess || addCandidateSkillMutation.isError) {
        addCandidateSkillMutation.reset();
      }
    };
  }, [addCandidateSkillMutation]);

  return (
    <Controls
      title={`Create ${CANDIDATESKILL_CONSTANTS.ENTITY_NAME}`}
      open={showForm}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={handleSubmit}
      type="drawer"
      width={600}
      loading={addCandidateSkillMutation.isPending}>
      <FormProvider {...form}>
        <CandidateSkillForm />
      </FormProvider>
    </Controls>
  );
};

export default CandidateSkillCreateDrawer;
