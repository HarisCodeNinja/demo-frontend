import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { DepartmentCard } from './departmentCard';
import DepartmentCreateController from './departmentCreateController';
import DepartmentUpdateController from './departmentUpdateController';
import DepartmentViewController from './departmentViewController';
import DEPARTMENT_CONSTANTS from '../constants';
import { useDepartmentTableConfig } from '../hooks/useDepartmentTable';
import { IDepartmentQueryParams, IDepartmentIndex } from '../interface';
import { Heart } from 'lucide-react';

interface DepartmentTableProps {
  setDepartmentCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IDepartmentQueryParams>>;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({ setDepartmentCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useDepartmentTableConfig({
    setDepartmentCount,
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
        <MobileCardsView<IDepartmentIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={DepartmentCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.departmentId || index}
        />
		<DepartmentCreateController />
		<DepartmentUpdateController />
		<DepartmentViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={DEPARTMENT_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <DepartmentCreateController />
	  <DepartmentUpdateController />
	  <DepartmentViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={DEPARTMENT_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default DepartmentTable;