import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getDesignationEditDetails, updateDesignation } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateDesignationPayloadValidator } from '../validation';
import { IDesignationEdit } from '../interface';
import DesignationUpdateForm from '../form/designationUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import DESIGNATION_CONSTANTS from '../constants';

const DesignationUpdateDrawer: React.FC = () => {
  const { [DESIGNATION_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: designationResponse, isLoading: isLoadingDesignation } = useQuery({
    queryKey: [DESIGNATION_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.designationId, showEdit],
    queryFn: () => getDesignationEditDetails(primaryKeys?.designationId || 0),
    enabled: Boolean(showEdit && primaryKeys?.designationId),
  });

  const updateDesignationMutation = useMutation({
    mutationFn: updateDesignation,
  });

  const isLoading = isLoadingDesignation || updateDesignationMutation.isPending;
  const form = useForm<z.infer<typeof updateDesignationPayloadValidator>>({
    resolver: zodResolver(updateDesignationPayloadValidator),
    defaultValues: getDefaultFormValues(updateDesignationPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (designationResponse?.data) {
      form.reset(designationResponse.data);
    }
  }, [designationResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateDesignationPayloadValidator>) => {
      try {
        await updateDesignationMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [DESIGNATION_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateDesignationMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateDesignationPayloadValidator));
    dispatch(resetSelectedObj(DESIGNATION_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${DESIGNATION_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <DesignationUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default DesignationUpdateDrawer;
