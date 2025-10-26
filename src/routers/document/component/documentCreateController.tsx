import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addDocument } from '../service';
	import { createDocumentPayloadValidator } from '../validation';
	import { IDocumentAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import DOCUMENT_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import DocumentForm from '../form/documentCreate';

type CreateDocumentFormData = z.infer<typeof createDocumentPayloadValidator>;

const DocumentCreateDrawer: React.FC = () => {
  const { [DOCUMENT_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addDocumentMutation = useMutation({
    mutationFn: addDocument,
  });

  const form = useForm<CreateDocumentFormData>({
    resolver: zodResolver(createDocumentPayloadValidator),
    defaultValues: getDefaultFormValues(createDocumentPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateDocumentFormData) => {
      try {
        await addDocumentMutation.mutateAsync(data as IDocumentAdd);
        queryClient.invalidateQueries({ queryKey: [DOCUMENT_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addDocumentMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createDocumentPayloadValidator));
    dispatch(resetSelectedObj(DOCUMENT_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createDocumentPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addDocumentMutation.isSuccess || addDocumentMutation.isError) {
        addDocumentMutation.reset();
      }
    };
  }, [addDocumentMutation]);

  return (
  <Controls title={`Create ${DOCUMENT_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={600} loading={addDocumentMutation.isPending}>
    <FormProvider {...form}>
      <DocumentForm />
    </FormProvider>
  </Controls>
);
};

export default DocumentCreateDrawer;
