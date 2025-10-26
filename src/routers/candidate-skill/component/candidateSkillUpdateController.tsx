import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getCandidateSkillEditDetails, updateCandidateSkill } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateCandidateSkillPayloadValidator } from '../validation';
import { ICandidateSkillEdit } from '../interface';
import CandidateSkillUpdateForm from '../form/candidateSkillUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import CANDIDATESKILL_CONSTANTS from '../constants';


const CandidateSkillUpdateDrawer: React.FC = () => {
  const { [CANDIDATESKILL_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: candidateSkillResponse, isLoading: isLoadingCandidateSkill } = useQuery({
    queryKey: [CANDIDATESKILL_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.candidateSkillId, showEdit],
    queryFn: () => getCandidateSkillEditDetails(primaryKeys?.candidateSkillId || 0),
    enabled: Boolean(showEdit && primaryKeys?.candidateSkillId),
  });


  const updateCandidateSkillMutation = useMutation({
    mutationFn: updateCandidateSkill,
  });

  const isLoading = isLoadingCandidateSkill || updateCandidateSkillMutation.isPending;
  const form = useForm<z.infer<typeof updateCandidateSkillPayloadValidator>>({
  resolver: zodResolver(updateCandidateSkillPayloadValidator),
  defaultValues: getDefaultFormValues(updateCandidateSkillPayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (candidateSkillResponse?.data) {
      form.reset(candidateSkillResponse.data);
    }
  }, [candidateSkillResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateCandidateSkillPayloadValidator>) => {
    try {
      await updateCandidateSkillMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [CANDIDATESKILL_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateCandidateSkillMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateCandidateSkillPayloadValidator));
  dispatch(resetSelectedObj(CANDIDATESKILL_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${CANDIDATESKILL_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <CandidateSkillUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default CandidateSkillUpdateDrawer;
