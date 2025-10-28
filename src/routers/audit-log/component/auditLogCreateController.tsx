import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addAuditLog } from '../service';
import { createAuditLogPayloadValidator } from '../validation';
import { IAuditLogAdd } from '../interface';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import AUDITLOG_CONSTANTS from '../constants';

import Controls from '@/components/Wrapper/controls';
import AuditLogForm from '../form/auditLogCreate';

type CreateAuditLogFormData = z.infer<typeof createAuditLogPayloadValidator>;

const AuditLogCreateDrawer: React.FC = () => {
  const { [AUDITLOG_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addAuditLogMutation = useMutation({
    mutationFn: addAuditLog,
  });

  const form = useForm<CreateAuditLogFormData>({
    resolver: zodResolver(createAuditLogPayloadValidator),
    defaultValues: getDefaultFormValues(createAuditLogPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateAuditLogFormData) => {
      try {
        await addAuditLogMutation.mutateAsync(data as IAuditLogAdd);
        queryClient.invalidateQueries({ queryKey: [AUDITLOG_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addAuditLogMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createAuditLogPayloadValidator));
    dispatch(resetSelectedObj(AUDITLOG_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createAuditLogPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addAuditLogMutation.isSuccess || addAuditLogMutation.isError) {
        addAuditLogMutation.reset();
      }
    };
  }, [addAuditLogMutation]);

  return (
    <Controls
      title={`Create ${AUDITLOG_CONSTANTS.ENTITY_NAME}`}
      open={showForm}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={handleSubmit}
      type="drawer"
      width={600}
      loading={addAuditLogMutation.isPending}>
      <FormProvider {...form}>
        <AuditLogForm />
      </FormProvider>
    </Controls>
  );
};

export default AuditLogCreateDrawer;
