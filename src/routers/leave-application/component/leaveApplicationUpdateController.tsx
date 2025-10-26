import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getLeaveApplicationEditDetails, updateLeaveApplication } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateLeaveApplicationPayloadValidator } from '../validation';
import { ILeaveApplicationEdit } from '../interface';
import LeaveApplicationUpdateForm from '../form/leaveApplicationUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import LEAVEAPPLICATION_CONSTANTS from '../constants';


const LeaveApplicationUpdateDrawer: React.FC = () => {
  const { [LEAVEAPPLICATION_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: leaveApplicationResponse, isLoading: isLoadingLeaveApplication } = useQuery({
    queryKey: [LEAVEAPPLICATION_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.leaveApplicationId, showEdit],
    queryFn: () => getLeaveApplicationEditDetails(primaryKeys?.leaveApplicationId || 0),
    enabled: Boolean(showEdit && primaryKeys?.leaveApplicationId),
  });


  const updateLeaveApplicationMutation = useMutation({
    mutationFn: updateLeaveApplication,
  });

  const isLoading = isLoadingLeaveApplication || updateLeaveApplicationMutation.isPending;
  const form = useForm<z.infer<typeof updateLeaveApplicationPayloadValidator>>({
  resolver: zodResolver(updateLeaveApplicationPayloadValidator),
  defaultValues: getDefaultFormValues(updateLeaveApplicationPayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (leaveApplicationResponse?.data) {
      form.reset(leaveApplicationResponse.data);
    }
  }, [leaveApplicationResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateLeaveApplicationPayloadValidator>) => {
    try {
      await updateLeaveApplicationMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [LEAVEAPPLICATION_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateLeaveApplicationMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateLeaveApplicationPayloadValidator));
  dispatch(resetSelectedObj(LEAVEAPPLICATION_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${LEAVEAPPLICATION_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <LeaveApplicationUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default LeaveApplicationUpdateDrawer;
