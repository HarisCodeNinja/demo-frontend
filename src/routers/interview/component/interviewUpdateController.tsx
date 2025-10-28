import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getInterviewEditDetails, updateInterview } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateInterviewPayloadValidator } from '../validation';
import { IInterviewEdit } from '../interface';
import InterviewUpdateForm from '../form/interviewUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import INTERVIEW_CONSTANTS from '../constants';

const InterviewUpdateDrawer: React.FC = () => {
  const { [INTERVIEW_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: interviewResponse, isLoading: isLoadingInterview } = useQuery({
    queryKey: [INTERVIEW_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.interviewId, showEdit],
    queryFn: () => getInterviewEditDetails(primaryKeys?.interviewId || 0),
    enabled: Boolean(showEdit && primaryKeys?.interviewId),
  });

  const updateInterviewMutation = useMutation({
    mutationFn: updateInterview,
  });

  const isLoading = isLoadingInterview || updateInterviewMutation.isPending;
  const form = useForm<z.infer<typeof updateInterviewPayloadValidator>>({
    resolver: zodResolver(updateInterviewPayloadValidator),
    defaultValues: getDefaultFormValues(updateInterviewPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (interviewResponse?.data) {
      form.reset(interviewResponse.data);
    }
  }, [interviewResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateInterviewPayloadValidator>) => {
      try {
        await updateInterviewMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [INTERVIEW_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateInterviewMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateInterviewPayloadValidator));
    dispatch(resetSelectedObj(INTERVIEW_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${INTERVIEW_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <InterviewUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default InterviewUpdateDrawer;
