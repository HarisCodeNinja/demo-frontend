import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { LocationCard } from './locationCard';
import LocationCreateController from './locationCreateController';
import LocationUpdateController from './locationUpdateController';
import LocationViewController from './locationViewController';
import LOCATION_CONSTANTS from '../constants';
import { useLocationTableConfig } from '../hooks/useLocationTable';
import { ILocationQueryParams, ILocationIndex } from '../interface';
import { Heart } from 'lucide-react';

interface LocationTableProps {
  setLocationCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<ILocationQueryParams>>;
}

const LocationTable: React.FC<LocationTableProps> = ({ setLocationCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useLocationTableConfig({
    setLocationCount,
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
        <MobileCardsView<ILocationIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={LocationCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.locationId || index}
        />
		<LocationCreateController />
		<LocationUpdateController />
		<LocationViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={LOCATION_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <LocationCreateController />
	  <LocationUpdateController />
	  <LocationViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={LOCATION_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default LocationTable;