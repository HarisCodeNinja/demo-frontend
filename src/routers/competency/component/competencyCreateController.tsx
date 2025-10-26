import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addCompetency } from '../service';
	import { createCompetencyPayloadValidator } from '../validation';
	import { ICompetencyAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import COMPETENCY_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import CompetencyForm from '../form/competencyCreate';

type CreateCompetencyFormData = z.infer<typeof createCompetencyPayloadValidator>;

const CompetencyCreateDrawer: React.FC = () => {
  const { [COMPETENCY_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addCompetencyMutation = useMutation({
    mutationFn: addCompetency,
  });

  const form = useForm<CreateCompetencyFormData>({
    resolver: zodResolver(createCompetencyPayloadValidator),
    defaultValues: getDefaultFormValues(createCompetencyPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateCompetencyFormData) => {
      try {
        await addCompetencyMutation.mutateAsync(data as ICompetencyAdd);
        queryClient.invalidateQueries({ queryKey: [COMPETENCY_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addCompetencyMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createCompetencyPayloadValidator));
    dispatch(resetSelectedObj(COMPETENCY_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createCompetencyPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addCompetencyMutation.isSuccess || addCompetencyMutation.isError) {
        addCompetencyMutation.reset();
      }
    };
  }, [addCompetencyMutation]);

  return (
  <Controls title={`Create ${COMPETENCY_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addCompetencyMutation.isPending}>
    <FormProvider {...form}>
      <CompetencyForm />
    </FormProvider>
  </Controls>
);
};

export default CompetencyCreateDrawer;
