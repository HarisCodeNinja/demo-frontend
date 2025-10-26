import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { RoleCompetencyCard } from './roleCompetencyCard';
import RoleCompetencyCreateController from './roleCompetencyCreateController';
import RoleCompetencyUpdateController from './roleCompetencyUpdateController';
import RoleCompetencyViewController from './roleCompetencyViewController';
import ROLECOMPETENCY_CONSTANTS from '../constants';
import { useRoleCompetencyTableConfig } from '../hooks/useRoleCompetencyTable';
import { IRoleCompetencyQueryParams, IRoleCompetencyIndex } from '../interface';
import { Heart } from 'lucide-react';

interface RoleCompetencyTableProps {
  setRoleCompetencyCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IRoleCompetencyQueryParams>>;
}

const RoleCompetencyTable: React.FC<RoleCompetencyTableProps> = ({ setRoleCompetencyCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useRoleCompetencyTableConfig({
    setRoleCompetencyCount,
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
        <MobileCardsView<IRoleCompetencyIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={RoleCompetencyCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.roleCompetencyId || index}
        />
		<RoleCompetencyCreateController />
		<RoleCompetencyUpdateController />
		<RoleCompetencyViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={ROLECOMPETENCY_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <RoleCompetencyCreateController />
	  <RoleCompetencyUpdateController />
	  <RoleCompetencyViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={ROLECOMPETENCY_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default RoleCompetencyTable;