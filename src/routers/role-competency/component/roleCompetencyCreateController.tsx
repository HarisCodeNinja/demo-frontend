import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addRoleCompetency } from '../service';
import { createRoleCompetencyPayloadValidator } from '../validation';
import { IRoleCompetencyAdd } from '../interface';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import ROLECOMPETENCY_CONSTANTS from '../constants';

import Controls from '@/components/Wrapper/controls';
import RoleCompetencyForm from '../form/roleCompetencyCreate';

type CreateRoleCompetencyFormData = z.infer<typeof createRoleCompetencyPayloadValidator>;

const RoleCompetencyCreateDrawer: React.FC = () => {
  const { [ROLECOMPETENCY_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addRoleCompetencyMutation = useMutation({
    mutationFn: addRoleCompetency,
  });

  const form = useForm<CreateRoleCompetencyFormData>({
    resolver: zodResolver(createRoleCompetencyPayloadValidator),
    defaultValues: getDefaultFormValues(createRoleCompetencyPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateRoleCompetencyFormData) => {
      try {
        await addRoleCompetencyMutation.mutateAsync(data as IRoleCompetencyAdd);
        queryClient.invalidateQueries({ queryKey: [ROLECOMPETENCY_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addRoleCompetencyMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createRoleCompetencyPayloadValidator));
    dispatch(resetSelectedObj(ROLECOMPETENCY_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createRoleCompetencyPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addRoleCompetencyMutation.isSuccess || addRoleCompetencyMutation.isError) {
        addRoleCompetencyMutation.reset();
      }
    };
  }, [addRoleCompetencyMutation]);

  return (
    <Controls
      title={`Create ${ROLECOMPETENCY_CONSTANTS.ENTITY_NAME}`}
      open={showForm}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={handleSubmit}
      type="drawer"
      width={600}
      loading={addRoleCompetencyMutation.isPending}>
      <FormProvider {...form}>
        <RoleCompetencyForm />
      </FormProvider>
    </Controls>
  );
};

export default RoleCompetencyCreateDrawer;
