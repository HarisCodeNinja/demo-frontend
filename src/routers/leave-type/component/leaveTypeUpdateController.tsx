import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getLeaveTypeEditDetails, updateLeaveType } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateLeaveTypePayloadValidator } from '../validation';
import { ILeaveTypeEdit } from '../interface';
import LeaveTypeUpdateForm from '../form/leaveTypeUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import LEAVETYPE_CONSTANTS from '../constants';


const LeaveTypeUpdateDrawer: React.FC = () => {
  const { [LEAVETYPE_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: leaveTypeResponse, isLoading: isLoadingLeaveType } = useQuery({
    queryKey: [LEAVETYPE_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.leaveTypeId, showEdit],
    queryFn: () => getLeaveTypeEditDetails(primaryKeys?.leaveTypeId || 0),
    enabled: Boolean(showEdit && primaryKeys?.leaveTypeId),
  });


  const updateLeaveTypeMutation = useMutation({
    mutationFn: updateLeaveType,
  });

  const isLoading = isLoadingLeaveType || updateLeaveTypeMutation.isPending;
  const form = useForm<z.infer<typeof updateLeaveTypePayloadValidator>>({
  resolver: zodResolver(updateLeaveTypePayloadValidator),
  defaultValues: getDefaultFormValues(updateLeaveTypePayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (leaveTypeResponse?.data) {
      form.reset(leaveTypeResponse.data);
    }
  }, [leaveTypeResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateLeaveTypePayloadValidator>) => {
    try {
      await updateLeaveTypeMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [LEAVETYPE_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateLeaveTypeMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateLeaveTypePayloadValidator));
  dispatch(resetSelectedObj(LEAVETYPE_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${LEAVETYPE_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <LeaveTypeUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default LeaveTypeUpdateDrawer;
