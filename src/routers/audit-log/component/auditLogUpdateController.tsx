import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAuditLogEditDetails, updateAuditLog } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateAuditLogPayloadValidator } from '../validation';
import { IAuditLogEdit } from '../interface';
import AuditLogUpdateForm from '../form/auditLogUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import AUDITLOG_CONSTANTS from '../constants';

const AuditLogUpdateDrawer: React.FC = () => {
  const { [AUDITLOG_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: auditLogResponse, isLoading: isLoadingAuditLog } = useQuery({
    queryKey: [AUDITLOG_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.auditLogId, showEdit],
    queryFn: () => getAuditLogEditDetails(primaryKeys?.auditLogId || 0),
    enabled: Boolean(showEdit && primaryKeys?.auditLogId),
  });

  const updateAuditLogMutation = useMutation({
    mutationFn: updateAuditLog,
  });

  const isLoading = isLoadingAuditLog || updateAuditLogMutation.isPending;
  const form = useForm<z.infer<typeof updateAuditLogPayloadValidator>>({
    resolver: zodResolver(updateAuditLogPayloadValidator),
    defaultValues: getDefaultFormValues(updateAuditLogPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (auditLogResponse?.data) {
      form.reset(auditLogResponse.data);
    }
  }, [auditLogResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateAuditLogPayloadValidator>) => {
      try {
        await updateAuditLogMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [AUDITLOG_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateAuditLogMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateAuditLogPayloadValidator));
    dispatch(resetSelectedObj(AUDITLOG_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${AUDITLOG_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <AuditLogUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default AuditLogUpdateDrawer;
