import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { DesignationCard } from './designationCard';
import DesignationCreateController from './designationCreateController';
import DesignationUpdateController from './designationUpdateController';
import DesignationViewController from './designationViewController';
import DESIGNATION_CONSTANTS from '../constants';
import { useDesignationTableConfig } from '../hooks/useDesignationTable';
import { IDesignationQueryParams, IDesignationIndex } from '../interface';
import { Heart } from 'lucide-react';

interface DesignationTableProps {
  setDesignationCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IDesignationQueryParams>>;
}

const DesignationTable: React.FC<DesignationTableProps> = ({ setDesignationCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useDesignationTableConfig({
    setDesignationCount,
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
        <MobileCardsView<IDesignationIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={DesignationCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.designationId || index}
        />
		<DesignationCreateController />
		<DesignationUpdateController />
		<DesignationViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={DESIGNATION_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <DesignationCreateController />
	  <DesignationUpdateController />
	  <DesignationViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={DESIGNATION_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default DesignationTable;