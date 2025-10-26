import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addPayslip } from '../service';
	import { createPayslipPayloadValidator } from '../validation';
	import { IPayslipAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import PAYSLIP_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import PayslipForm from '../form/payslipCreate';

type CreatePayslipFormData = z.infer<typeof createPayslipPayloadValidator>;

const PayslipCreateDrawer: React.FC = () => {
  const { [PAYSLIP_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addPayslipMutation = useMutation({
    mutationFn: addPayslip,
  });

  const form = useForm<CreatePayslipFormData>({
    resolver: zodResolver(createPayslipPayloadValidator),
    defaultValues: getDefaultFormValues(createPayslipPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreatePayslipFormData) => {
      try {
        await addPayslipMutation.mutateAsync(data as IPayslipAdd);
        queryClient.invalidateQueries({ queryKey: [PAYSLIP_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addPayslipMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createPayslipPayloadValidator));
    dispatch(resetSelectedObj(PAYSLIP_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createPayslipPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addPayslipMutation.isSuccess || addPayslipMutation.isError) {
        addPayslipMutation.reset();
      }
    };
  }, [addPayslipMutation]);

  return (
  <Controls title={`Create ${PAYSLIP_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addPayslipMutation.isPending}>
    <FormProvider {...form}>
      <PayslipForm />
    </FormProvider>
  </Controls>
);
};

export default PayslipCreateDrawer;
