import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addCandidate } from '../service';
	import { createCandidatePayloadValidator } from '../validation';
	import { ICandidateAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import CANDIDATE_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import CandidateForm from '../form/candidateCreate';

type CreateCandidateFormData = z.infer<typeof createCandidatePayloadValidator>;

const CandidateCreateDrawer: React.FC = () => {
  const { [CANDIDATE_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addCandidateMutation = useMutation({
    mutationFn: addCandidate,
  });

  const form = useForm<CreateCandidateFormData>({
    resolver: zodResolver(createCandidatePayloadValidator),
    defaultValues: getDefaultFormValues(createCandidatePayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateCandidateFormData) => {
      try {
        await addCandidateMutation.mutateAsync(data as ICandidateAdd);
        queryClient.invalidateQueries({ queryKey: [CANDIDATE_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addCandidateMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createCandidatePayloadValidator));
    dispatch(resetSelectedObj(CANDIDATE_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createCandidatePayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addCandidateMutation.isSuccess || addCandidateMutation.isError) {
        addCandidateMutation.reset();
      }
    };
  }, [addCandidateMutation]);

  return (
  <Controls title={`Create ${CANDIDATE_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addCandidateMutation.isPending}>
    <FormProvider {...form}>
      <CandidateForm />
    </FormProvider>
  </Controls>
);
};

export default CandidateCreateDrawer;
