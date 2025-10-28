import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addLeaveApplication } from '../service';
import { createLeaveApplicationPayloadValidator } from '../validation';
import { ILeaveApplicationAdd } from '../interface';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import LEAVEAPPLICATION_CONSTANTS from '../constants';

import Controls from '@/components/Wrapper/controls';
import LeaveApplicationForm from '../form/leaveApplicationCreate';

type CreateLeaveApplicationFormData = z.infer<typeof createLeaveApplicationPayloadValidator>;

const LeaveApplicationCreateDrawer: React.FC = () => {
  const { [LEAVEAPPLICATION_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addLeaveApplicationMutation = useMutation({
    mutationFn: addLeaveApplication,
  });

  const form = useForm<CreateLeaveApplicationFormData>({
    resolver: zodResolver(createLeaveApplicationPayloadValidator),
    defaultValues: getDefaultFormValues(createLeaveApplicationPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateLeaveApplicationFormData) => {
      try {
        await addLeaveApplicationMutation.mutateAsync(data as ILeaveApplicationAdd);
        queryClient.invalidateQueries({ queryKey: [LEAVEAPPLICATION_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addLeaveApplicationMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createLeaveApplicationPayloadValidator));
    dispatch(resetSelectedObj(LEAVEAPPLICATION_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createLeaveApplicationPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addLeaveApplicationMutation.isSuccess || addLeaveApplicationMutation.isError) {
        addLeaveApplicationMutation.reset();
      }
    };
  }, [addLeaveApplicationMutation]);

  return (
    <Controls
      title={`Create ${LEAVEAPPLICATION_CONSTANTS.ENTITY_NAME}`}
      open={showForm}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={handleSubmit}
      type="drawer"
      width={600}
      loading={addLeaveApplicationMutation.isPending}>
      <FormProvider {...form}>
        <LeaveApplicationForm />
      </FormProvider>
    </Controls>
  );
};

export default LeaveApplicationCreateDrawer;
