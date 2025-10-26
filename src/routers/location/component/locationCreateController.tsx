import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addLocation } from '../service';
	import { createLocationPayloadValidator } from '../validation';
	import { ILocationAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import LOCATION_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import LocationForm from '../form/locationCreate';

type CreateLocationFormData = z.infer<typeof createLocationPayloadValidator>;

const LocationCreateDrawer: React.FC = () => {
  const { [LOCATION_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addLocationMutation = useMutation({
    mutationFn: addLocation,
  });

  const form = useForm<CreateLocationFormData>({
    resolver: zodResolver(createLocationPayloadValidator),
    defaultValues: getDefaultFormValues(createLocationPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateLocationFormData) => {
      try {
        await addLocationMutation.mutateAsync(data as ILocationAdd);
        queryClient.invalidateQueries({ queryKey: [LOCATION_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addLocationMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createLocationPayloadValidator));
    dispatch(resetSelectedObj(LOCATION_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createLocationPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addLocationMutation.isSuccess || addLocationMutation.isError) {
        addLocationMutation.reset();
      }
    };
  }, [addLocationMutation]);

  return (
  <Controls title={`Create ${LOCATION_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addLocationMutation.isPending}>
    <FormProvider {...form}>
      <LocationForm />
    </FormProvider>
  </Controls>
);
};

export default LocationCreateDrawer;
