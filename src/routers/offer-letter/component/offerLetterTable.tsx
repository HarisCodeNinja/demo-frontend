import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { OfferLetterCard } from './offerLetterCard';
import OfferLetterCreateController from './offerLetterCreateController';
import OfferLetterUpdateController from './offerLetterUpdateController';
import OfferLetterViewController from './offerLetterViewController';
import OFFERLETTER_CONSTANTS from '../constants';
import { useOfferLetterTableConfig } from '../hooks/useOfferLetterTable';
import { IOfferLetterQueryParams, IOfferLetterIndex } from '../interface';
import { Heart } from 'lucide-react';

interface OfferLetterTableProps {
  setOfferLetterCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IOfferLetterQueryParams>>;
}

const OfferLetterTable: React.FC<OfferLetterTableProps> = ({ setOfferLetterCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useOfferLetterTableConfig({
    setOfferLetterCount,
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
        <MobileCardsView<IOfferLetterIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={OfferLetterCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.offerLetterId || index}
        />
		<OfferLetterCreateController />
		<OfferLetterUpdateController />
		<OfferLetterViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={OFFERLETTER_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <OfferLetterCreateController />
	  <OfferLetterUpdateController />
	  <OfferLetterViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={OFFERLETTER_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default OfferLetterTable;