import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getDocumentDetails } from '../service';
import DOCUMENT_CONSTANTS from '../constants';

interface ViewProps {}

const DocumentViewController: React.FC<ViewProps> = ({}) => {
  const { [DOCUMENT_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: document, isLoading } = useQuery({
    queryKey: [DOCUMENT_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.documentId, showView],
    queryFn: () => getDocumentDetails(primaryKeys?.documentId || 0),
    enabled: Boolean(showView && primaryKeys?.documentId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(DOCUMENT_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && document && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Document Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{document?.data?.documentId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employee Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{document?.data?.employeeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Document Type</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{document?.data?.documentType ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>File Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{document?.data?.fileName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>File Url</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{document?.data?.fileUrl ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Uploaded By</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{document?.data?.uploadedBy ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{document?.data?.createdAt ? new Date(document?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{document?.data?.updatedAt ? new Date(document?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${DOCUMENT_CONSTANTS.ENTITY_NAME} Details`}
      open={showView}
      onClose={handleClose}
      type="modal"
      width={800}
      loading={isLoading}
    >
      <Content />
    </Controls>
  );
};

export default DocumentViewController;