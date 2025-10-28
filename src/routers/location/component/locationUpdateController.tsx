import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getLocationEditDetails, updateLocation } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateLocationPayloadValidator } from '../validation';
import { ILocationEdit } from '../interface';
import LocationUpdateForm from '../form/locationUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import LOCATION_CONSTANTS from '../constants';

const LocationUpdateDrawer: React.FC = () => {
  const { [LOCATION_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: locationResponse, isLoading: isLoadingLocation } = useQuery({
    queryKey: [LOCATION_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.locationId, showEdit],
    queryFn: () => getLocationEditDetails(primaryKeys?.locationId || 0),
    enabled: Boolean(showEdit && primaryKeys?.locationId),
  });

  const updateLocationMutation = useMutation({
    mutationFn: updateLocation,
  });

  const isLoading = isLoadingLocation || updateLocationMutation.isPending;
  const form = useForm<z.infer<typeof updateLocationPayloadValidator>>({
    resolver: zodResolver(updateLocationPayloadValidator),
    defaultValues: getDefaultFormValues(updateLocationPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (locationResponse?.data) {
      form.reset(locationResponse.data);
    }
  }, [locationResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateLocationPayloadValidator>) => {
      try {
        await updateLocationMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [LOCATION_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateLocationMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateLocationPayloadValidator));
    dispatch(resetSelectedObj(LOCATION_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${LOCATION_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <LocationUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default LocationUpdateDrawer;
