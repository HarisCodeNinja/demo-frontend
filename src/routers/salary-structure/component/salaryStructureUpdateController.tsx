import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getSalaryStructureEditDetails, updateSalaryStructure } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateSalaryStructurePayloadValidator } from '../validation';
import { ISalaryStructureEdit } from '../interface';
import SalaryStructureUpdateForm from '../form/salaryStructureUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import SALARYSTRUCTURE_CONSTANTS from '../constants';

const SalaryStructureUpdateDrawer: React.FC = () => {
  const { [SALARYSTRUCTURE_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: salaryStructureResponse, isLoading: isLoadingSalaryStructure } = useQuery({
    queryKey: [SALARYSTRUCTURE_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.salaryStructureId, showEdit],
    queryFn: () => getSalaryStructureEditDetails(primaryKeys?.salaryStructureId || 0),
    enabled: Boolean(showEdit && primaryKeys?.salaryStructureId),
  });

  const updateSalaryStructureMutation = useMutation({
    mutationFn: updateSalaryStructure,
  });

  const isLoading = isLoadingSalaryStructure || updateSalaryStructureMutation.isPending;
  const form = useForm<z.infer<typeof updateSalaryStructurePayloadValidator>>({
    resolver: zodResolver(updateSalaryStructurePayloadValidator),
    defaultValues: getDefaultFormValues(updateSalaryStructurePayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (salaryStructureResponse?.data) {
      form.reset(salaryStructureResponse.data);
    }
  }, [salaryStructureResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateSalaryStructurePayloadValidator>) => {
      try {
        await updateSalaryStructureMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [SALARYSTRUCTURE_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateSalaryStructureMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateSalaryStructurePayloadValidator));
    dispatch(resetSelectedObj(SALARYSTRUCTURE_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${SALARYSTRUCTURE_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <SalaryStructureUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default SalaryStructureUpdateDrawer;
