import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { DocumentCard } from './documentCard';
import DocumentCreateController from './documentCreateController';
import DocumentUpdateController from './documentUpdateController';
import DocumentViewController from './documentViewController';
import DOCUMENT_CONSTANTS from '../constants';
import { useDocumentTableConfig } from '../hooks/useDocumentTable';
import { IDocumentQueryParams, IDocumentIndex } from '../interface';
import { Heart } from 'lucide-react';

interface DocumentTableProps {
  setDocumentCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IDocumentQueryParams>>;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ setDocumentCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useDocumentTableConfig({
    setDocumentCount,
    setCurrentPageCount,
  });
  const isMobile = useIsMobile();
  const prevQueryParamsRef = useRef<string>(null);

  useEffect(() => {
    if (!setCurrentQueryParams) return;

    const queryParamsStr = JSON.stringify(queryParams);
    if (prevQueryParamsRef.current !== queryParamsStr) {
      prevQueryParamsRef.current = queryParamsStr;
      setCurrentQueryParams(queryParams);
    }
  }, [queryParams, setCurrentQueryParams]);

  if (isMobile) {
    return (
      <>
        <MobileCardsView<IDocumentIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={DocumentCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.documentId || index}
        />
		<DocumentCreateController />
		<DocumentUpdateController />
		<DocumentViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={DOCUMENT_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
      </>
    );
  }

  return (
    <>
      <GenericTable
        {...tableProps}
        columns={visibleColumns}
        actions={actions}
        totalCount={tableProps.data.length > 0 ? undefined : 0}
      />
	  <DocumentCreateController />
	  <DocumentUpdateController />
	  <DocumentViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={DOCUMENT_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default DocumentTable;