import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getRoleCompetencyEditDetails, updateRoleCompetency } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateRoleCompetencyPayloadValidator } from '../validation';
import { IRoleCompetencyEdit } from '../interface';
import RoleCompetencyUpdateForm from '../form/roleCompetencyUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import ROLECOMPETENCY_CONSTANTS from '../constants';

const RoleCompetencyUpdateDrawer: React.FC = () => {
  const { [ROLECOMPETENCY_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: roleCompetencyResponse, isLoading: isLoadingRoleCompetency } = useQuery({
    queryKey: [ROLECOMPETENCY_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.roleCompetencyId, showEdit],
    queryFn: () => getRoleCompetencyEditDetails(primaryKeys?.roleCompetencyId || 0),
    enabled: Boolean(showEdit && primaryKeys?.roleCompetencyId),
  });

  const updateRoleCompetencyMutation = useMutation({
    mutationFn: updateRoleCompetency,
  });

  const isLoading = isLoadingRoleCompetency || updateRoleCompetencyMutation.isPending;
  const form = useForm<z.infer<typeof updateRoleCompetencyPayloadValidator>>({
    resolver: zodResolver(updateRoleCompetencyPayloadValidator),
    defaultValues: getDefaultFormValues(updateRoleCompetencyPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (roleCompetencyResponse?.data) {
      form.reset(roleCompetencyResponse.data);
    }
  }, [roleCompetencyResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateRoleCompetencyPayloadValidator>) => {
      try {
        await updateRoleCompetencyMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [ROLECOMPETENCY_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateRoleCompetencyMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateRoleCompetencyPayloadValidator));
    dispatch(resetSelectedObj(ROLECOMPETENCY_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${ROLECOMPETENCY_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <RoleCompetencyUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default RoleCompetencyUpdateDrawer;
