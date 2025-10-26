import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addEmployeeCompetency } from '../service';
	import { createEmployeeCompetencyPayloadValidator } from '../validation';
	import { IEmployeeCompetencyAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import EMPLOYEECOMPETENCY_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import EmployeeCompetencyForm from '../form/employeeCompetencyCreate';

type CreateEmployeeCompetencyFormData = z.infer<typeof createEmployeeCompetencyPayloadValidator>;

const EmployeeCompetencyCreateDrawer: React.FC = () => {
  const { [EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addEmployeeCompetencyMutation = useMutation({
    mutationFn: addEmployeeCompetency,
  });

  const form = useForm<CreateEmployeeCompetencyFormData>({
    resolver: zodResolver(createEmployeeCompetencyPayloadValidator),
    defaultValues: getDefaultFormValues(createEmployeeCompetencyPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateEmployeeCompetencyFormData) => {
      try {
        await addEmployeeCompetencyMutation.mutateAsync(data as IEmployeeCompetencyAdd);
        queryClient.invalidateQueries({ queryKey: [EMPLOYEECOMPETENCY_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addEmployeeCompetencyMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createEmployeeCompetencyPayloadValidator));
    dispatch(resetSelectedObj(EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createEmployeeCompetencyPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addEmployeeCompetencyMutation.isSuccess || addEmployeeCompetencyMutation.isError) {
        addEmployeeCompetencyMutation.reset();
      }
    };
  }, [addEmployeeCompetencyMutation]);

  return (
  <Controls title={`Create ${EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addEmployeeCompetencyMutation.isPending}>
    <FormProvider {...form}>
      <EmployeeCompetencyForm />
    </FormProvider>
  </Controls>
);
};

export default EmployeeCompetencyCreateDrawer;
