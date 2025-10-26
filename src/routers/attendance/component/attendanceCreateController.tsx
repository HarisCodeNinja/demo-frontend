import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addAttendance } from '../service';
	import { createAttendancePayloadValidator } from '../validation';
	import { IAttendanceAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import ATTENDANCE_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import AttendanceForm from '../form/attendanceCreate';

type CreateAttendanceFormData = z.infer<typeof createAttendancePayloadValidator>;

const AttendanceCreateDrawer: React.FC = () => {
  const { [ATTENDANCE_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addAttendanceMutation = useMutation({
    mutationFn: addAttendance,
  });

  const form = useForm<CreateAttendanceFormData>({
    resolver: zodResolver(createAttendancePayloadValidator),
    defaultValues: getDefaultFormValues(createAttendancePayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateAttendanceFormData) => {
      try {
        await addAttendanceMutation.mutateAsync(data as IAttendanceAdd);
        queryClient.invalidateQueries({ queryKey: [ATTENDANCE_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addAttendanceMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createAttendancePayloadValidator));
    dispatch(resetSelectedObj(ATTENDANCE_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createAttendancePayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addAttendanceMutation.isSuccess || addAttendanceMutation.isError) {
        addAttendanceMutation.reset();
      }
    };
  }, [addAttendanceMutation]);

  return (
  <Controls title={`Create ${ATTENDANCE_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addAttendanceMutation.isPending}>
    <FormProvider {...form}>
      <AttendanceForm />
    </FormProvider>
  </Controls>
);
};

export default AttendanceCreateDrawer;
