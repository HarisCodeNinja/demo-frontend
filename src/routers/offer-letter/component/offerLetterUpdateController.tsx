import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getOfferLetterEditDetails, updateOfferLetter } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateOfferLetterPayloadValidator } from '../validation';
import { IOfferLetterEdit } from '../interface';
import OfferLetterUpdateForm from '../form/offerLetterUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import OFFERLETTER_CONSTANTS from '../constants';


const OfferLetterUpdateDrawer: React.FC = () => {
  const { [OFFERLETTER_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: offerLetterResponse, isLoading: isLoadingOfferLetter } = useQuery({
    queryKey: [OFFERLETTER_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.offerLetterId, showEdit],
    queryFn: () => getOfferLetterEditDetails(primaryKeys?.offerLetterId || 0),
    enabled: Boolean(showEdit && primaryKeys?.offerLetterId),
  });


  const updateOfferLetterMutation = useMutation({
    mutationFn: updateOfferLetter,
  });

  const isLoading = isLoadingOfferLetter || updateOfferLetterMutation.isPending;
  const form = useForm<z.infer<typeof updateOfferLetterPayloadValidator>>({
  resolver: zodResolver(updateOfferLetterPayloadValidator),
  defaultValues: getDefaultFormValues(updateOfferLetterPayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (offerLetterResponse?.data) {
      form.reset(offerLetterResponse.data);
    }
  }, [offerLetterResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateOfferLetterPayloadValidator>) => {
    try {
      await updateOfferLetterMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [OFFERLETTER_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateOfferLetterMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateOfferLetterPayloadValidator));
  dispatch(resetSelectedObj(OFFERLETTER_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${OFFERLETTER_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <OfferLetterUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default OfferLetterUpdateDrawer;
