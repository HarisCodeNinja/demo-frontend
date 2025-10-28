import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getDocumentEditDetails, updateDocument } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateDocumentPayloadValidator } from '../validation';
import { IDocumentEdit } from '../interface';
import DocumentUpdateForm from '../form/documentUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import DOCUMENT_CONSTANTS from '../constants';

const DocumentUpdateDrawer: React.FC = () => {
  const { [DOCUMENT_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: documentResponse, isLoading: isLoadingDocument } = useQuery({
    queryKey: [DOCUMENT_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.documentId, showEdit],
    queryFn: () => getDocumentEditDetails(primaryKeys?.documentId || 0),
    enabled: Boolean(showEdit && primaryKeys?.documentId),
  });

  const updateDocumentMutation = useMutation({
    mutationFn: updateDocument,
  });

  const isLoading = isLoadingDocument || updateDocumentMutation.isPending;
  const form = useForm<z.infer<typeof updateDocumentPayloadValidator>>({
    resolver: zodResolver(updateDocumentPayloadValidator),
    defaultValues: getDefaultFormValues(updateDocumentPayloadValidator),
    mode: 'onChange',
  });

  useEffect(() => {
    if (documentResponse?.data) {
      form.reset(documentResponse.data);
    }
  }, [documentResponse, form]);

  const updateData = React.useCallback(
    async (data: z.infer<typeof updateDocumentPayloadValidator>) => {
      try {
        await updateDocumentMutation.mutateAsync({ ...data, ...primaryKeys });
        queryClient.invalidateQueries({ queryKey: [DOCUMENT_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [updateDocumentMutation, primaryKeys, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(updateDocumentPayloadValidator));
    dispatch(resetSelectedObj(DOCUMENT_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  return (
    <Controls
      title={`Edit ${DOCUMENT_CONSTANTS.ENTITY_NAME}`}
      open={showEdit}
      onClose={handleCloseDrawer}
      form={form}
      onSubmit={updateData}
      type="drawer"
      width={600}
      loading={isLoading}>
      <FormProvider {...form}>
        <DocumentUpdateForm />
      </FormProvider>
    </Controls>
  );
};

export default DocumentUpdateDrawer;
