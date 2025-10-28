import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addSalaryStructure } from '../service';
import { createSalaryStructurePayloadValidator } from '../validation';
import { ISalaryStructureAdd } from '../interface';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import SALARYSTRUCTURE_CONSTANTS from '../constants';

import Controls from '@/components/Wrapper/controls';
import SalaryStructureForm from '../form/salaryStructureCreate';

type CreateSalaryStructureFormData = z.infer<typeof createSalaryStructurePayloadValidator>;

const SalaryStructureCreateDrawer: React.FC = () => {
  const { [SALARYSTRUCTURE_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addSalaryStructureMutation = useMutation({
    mutationFn: addSalaryStructure,
  });

  const form = useForm<CreateSalaryStructureFormData>({
    resolver: zodResolver(createSalaryStructurePayloadValidator),
    defaultValues: getDefaultFormValues(createSalaryStructurePayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateSalaryStructureFormData) => {
      try {
        await addSalaryStructureMutation.mutateAsync(data as ISalaryStructureAdd);
        queryClient.invalidateQueries({ queryKey: [SALARYSTRUCTURE_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addSalaryStructureMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createSalaryStructurePayloadValidator));
    dispatch(resetSelectedObj(SALARYSTRUCTURE_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createSalaryStructurePayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addSalaryStructureMutation.isSuccess || addSalaryStructureMutation.isError) {
        addSalaryStructureMutation.reset();
      }
    };
  }, [addSalaryStructureMutation]);

  return (
    <Controls
      title={`Create ${SALARYSTRUCTURE_CONSTANTS.ENTITY_NAME}`}
      open={showForm}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={handleSubmit}
      type="drawer"
      width={600}
      loading={addSalaryStructureMutation.isPending}>
      <FormProvider {...form}>
        <SalaryStructureForm />
      </FormProvider>
    </Controls>
  );
};

export default SalaryStructureCreateDrawer;
