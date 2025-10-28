import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAttendanceEditDetails, updateAttendance } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateAttendancePayloadValidator } from '../validation';
import { IAttendanceEdit } from '../interface';
import AttendanceUpdateForm from '../form/attendanceUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import ATTENDANCE_CONSTANTS from '../constants';

const AttendanceUpdateDrawer: React.FC = () => {
  const { [ATTENDANCE_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: attendanceResponse, isLoading: isLoadingAttendance } = useQuery({
    queryKey: [ATTENDANCE_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.attendanceId, showEdit],
    queryFn: () => getAttendanceEditDetails(primaryKeys?.attendanceId || 0),
    enabled: Boolean(showEdit && primaryKeys?.attendanceId),
  });

  const updateAttendanceMutation = useMutation({
    mutationFn: updateAttendance,
  });

  const isLoading = isLoadingAttendance || updateAttendanceMutation.isPending;
  const form = useForm<z.infer<typeof updateAttendancePayloadValidator>>({
    resolver: zodResolver(updateAttendancePayloadValidator),
    defaultValues: getDefaultFormValues(updateAttendancePayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (attendanceResponse?.data) {
      form.reset(attendanceResponse.data);
    }
  }, [attendanceResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateAttendancePayloadValidator>) => {
      try {
        await updateAttendanceMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [ATTENDANCE_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateAttendanceMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateAttendancePayloadValidator));
    dispatch(resetSelectedObj(ATTENDANCE_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${ATTENDANCE_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <AttendanceUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default AttendanceUpdateDrawer;
