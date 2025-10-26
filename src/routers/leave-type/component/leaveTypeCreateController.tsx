import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addLeaveType } from '../service';
	import { createLeaveTypePayloadValidator } from '../validation';
	import { ILeaveTypeAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import LEAVETYPE_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import LeaveTypeForm from '../form/leaveTypeCreate';

type CreateLeaveTypeFormData = z.infer<typeof createLeaveTypePayloadValidator>;

const LeaveTypeCreateDrawer: React.FC = () => {
  const { [LEAVETYPE_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addLeaveTypeMutation = useMutation({
    mutationFn: addLeaveType,
  });

  const form = useForm<CreateLeaveTypeFormData>({
    resolver: zodResolver(createLeaveTypePayloadValidator),
    defaultValues: getDefaultFormValues(createLeaveTypePayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateLeaveTypeFormData) => {
      try {
        await addLeaveTypeMutation.mutateAsync(data as ILeaveTypeAdd);
        queryClient.invalidateQueries({ queryKey: [LEAVETYPE_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addLeaveTypeMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createLeaveTypePayloadValidator));
    dispatch(resetSelectedObj(LEAVETYPE_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createLeaveTypePayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addLeaveTypeMutation.isSuccess || addLeaveTypeMutation.isError) {
        addLeaveTypeMutation.reset();
      }
    };
  }, [addLeaveTypeMutation]);

  return (
  <Controls title={`Create ${LEAVETYPE_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addLeaveTypeMutation.isPending}>
    <FormProvider {...form}>
      <LeaveTypeForm />
    </FormProvider>
  </Controls>
);
};

export default LeaveTypeCreateDrawer;
