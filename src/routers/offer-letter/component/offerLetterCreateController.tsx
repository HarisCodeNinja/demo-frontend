import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addOfferLetter } from '../service';
	import { createOfferLetterPayloadValidator } from '../validation';
	import { IOfferLetterAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import OFFERLETTER_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import OfferLetterForm from '../form/offerLetterCreate';

type CreateOfferLetterFormData = z.infer<typeof createOfferLetterPayloadValidator>;

const OfferLetterCreateDrawer: React.FC = () => {
  const { [OFFERLETTER_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addOfferLetterMutation = useMutation({
    mutationFn: addOfferLetter,
  });

  const form = useForm<CreateOfferLetterFormData>({
    resolver: zodResolver(createOfferLetterPayloadValidator),
    defaultValues: getDefaultFormValues(createOfferLetterPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateOfferLetterFormData) => {
      try {
        await addOfferLetterMutation.mutateAsync(data as IOfferLetterAdd);
        queryClient.invalidateQueries({ queryKey: [OFFERLETTER_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addOfferLetterMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createOfferLetterPayloadValidator));
    dispatch(resetSelectedObj(OFFERLETTER_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createOfferLetterPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addOfferLetterMutation.isSuccess || addOfferLetterMutation.isError) {
        addOfferLetterMutation.reset();
      }
    };
  }, [addOfferLetterMutation]);

  return (
  <Controls title={`Create ${OFFERLETTER_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addOfferLetterMutation.isPending}>
    <FormProvider {...form}>
      <OfferLetterForm />
    </FormProvider>
  </Controls>
);
};

export default OfferLetterCreateDrawer;
