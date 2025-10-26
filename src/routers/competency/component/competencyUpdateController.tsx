import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getCompetencyEditDetails, updateCompetency } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateCompetencyPayloadValidator } from '../validation';
import { ICompetencyEdit } from '../interface';
import CompetencyUpdateForm from '../form/competencyUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import COMPETENCY_CONSTANTS from '../constants';


const CompetencyUpdateDrawer: React.FC = () => {
  const { [COMPETENCY_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: competencyResponse, isLoading: isLoadingCompetency } = useQuery({
    queryKey: [COMPETENCY_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.competencyId, showEdit],
    queryFn: () => getCompetencyEditDetails(primaryKeys?.competencyId || 0),
    enabled: Boolean(showEdit && primaryKeys?.competencyId),
  });


  const updateCompetencyMutation = useMutation({
    mutationFn: updateCompetency,
  });

  const isLoading = isLoadingCompetency || updateCompetencyMutation.isPending;
  const form = useForm<z.infer<typeof updateCompetencyPayloadValidator>>({
  resolver: zodResolver(updateCompetencyPayloadValidator),
  defaultValues: getDefaultFormValues(updateCompetencyPayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (competencyResponse?.data) {
      form.reset(competencyResponse.data);
    }
  }, [competencyResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateCompetencyPayloadValidator>) => {
    try {
      await updateCompetencyMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [COMPETENCY_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateCompetencyMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateCompetencyPayloadValidator));
  dispatch(resetSelectedObj(COMPETENCY_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${COMPETENCY_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <CompetencyUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default CompetencyUpdateDrawer;
