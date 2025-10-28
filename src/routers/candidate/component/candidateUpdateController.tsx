import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getCandidateEditDetails, updateCandidate } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateCandidatePayloadValidator } from '../validation';
import { ICandidateEdit } from '../interface';
import CandidateUpdateForm from '../form/candidateUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import CANDIDATE_CONSTANTS from '../constants';

const CandidateUpdateDrawer: React.FC = () => {
  const { [CANDIDATE_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: candidateResponse, isLoading: isLoadingCandidate } = useQuery({
    queryKey: [CANDIDATE_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.candidateId, showEdit],
    queryFn: () => getCandidateEditDetails(primaryKeys?.candidateId || 0),
    enabled: Boolean(showEdit && primaryKeys?.candidateId),
  });

  const updateCandidateMutation = useMutation({
    mutationFn: updateCandidate,
  });

  const isLoading = isLoadingCandidate || updateCandidateMutation.isPending;
  const form = useForm<z.infer<typeof updateCandidatePayloadValidator>>({
    resolver: zodResolver(updateCandidatePayloadValidator),
    defaultValues: getDefaultFormValues(updateCandidatePayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (candidateResponse?.data) {
      form.reset(candidateResponse.data);
    }
  }, [candidateResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateCandidatePayloadValidator>) => {
      try {
        await updateCandidateMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [CANDIDATE_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateCandidateMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateCandidatePayloadValidator));
    dispatch(resetSelectedObj(CANDIDATE_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${CANDIDATE_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <CandidateUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default CandidateUpdateDrawer;
