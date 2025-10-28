import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPayslipEditDetails, updatePayslip } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updatePayslipPayloadValidator } from '../validation';
import { IPayslipEdit } from '../interface';
import PayslipUpdateForm from '../form/payslipUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import PAYSLIP_CONSTANTS from '../constants';

const PayslipUpdateDrawer: React.FC = () => {
  const { [PAYSLIP_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: payslipResponse, isLoading: isLoadingPayslip } = useQuery({
    queryKey: [PAYSLIP_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.payslipId, showEdit],
    queryFn: () => getPayslipEditDetails(primaryKeys?.payslipId || 0),
    enabled: Boolean(showEdit && primaryKeys?.payslipId),
  });

  const updatePayslipMutation = useMutation({
    mutationFn: updatePayslip,
  });

  const isLoading = isLoadingPayslip || updatePayslipMutation.isPending;
  const form = useForm<z.infer<typeof updatePayslipPayloadValidator>>({
    resolver: zodResolver(updatePayslipPayloadValidator),
    defaultValues: getDefaultFormValues(updatePayslipPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (payslipResponse?.data) {
      form.reset(payslipResponse.data);
    }
  }, [payslipResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updatePayslipPayloadValidator>) => {
      try {
        await updatePayslipMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [PAYSLIP_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updatePayslipMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updatePayslipPayloadValidator));
    dispatch(resetSelectedObj(PAYSLIP_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${PAYSLIP_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <PayslipUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default PayslipUpdateDrawer;
