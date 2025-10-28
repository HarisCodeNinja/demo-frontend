import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getJobOpeningSkillEditDetails, updateJobOpeningSkill } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateJobOpeningSkillPayloadValidator } from '../validation';
import { IJobOpeningSkillEdit } from '../interface';
import JobOpeningSkillUpdateForm from '../form/jobOpeningSkillUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import JOBOPENINGSKILL_CONSTANTS from '../constants';

const JobOpeningSkillUpdateDrawer: React.FC = () => {
  const { [JOBOPENINGSKILL_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: jobOpeningSkillResponse, isLoading: isLoadingJobOpeningSkill } = useQuery({
    queryKey: [JOBOPENINGSKILL_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.jobOpeningSkillId, showEdit],
    queryFn: () => getJobOpeningSkillEditDetails(primaryKeys?.jobOpeningSkillId || 0),
    enabled: Boolean(showEdit && primaryKeys?.jobOpeningSkillId),
  });

  const updateJobOpeningSkillMutation = useMutation({
    mutationFn: updateJobOpeningSkill,
  });

  const isLoading = isLoadingJobOpeningSkill || updateJobOpeningSkillMutation.isPending;
  const form = useForm<z.infer<typeof updateJobOpeningSkillPayloadValidator>>({
    resolver: zodResolver(updateJobOpeningSkillPayloadValidator),
    defaultValues: getDefaultFormValues(updateJobOpeningSkillPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (jobOpeningSkillResponse?.data) {
      form.reset(jobOpeningSkillResponse.data);
    }
  }, [jobOpeningSkillResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateJobOpeningSkillPayloadValidator>) => {
      try {
        await updateJobOpeningSkillMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [JOBOPENINGSKILL_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateJobOpeningSkillMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateJobOpeningSkillPayloadValidator));
    dispatch(resetSelectedObj(JOBOPENINGSKILL_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${JOBOPENINGSKILL_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <JobOpeningSkillUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default JobOpeningSkillUpdateDrawer;
