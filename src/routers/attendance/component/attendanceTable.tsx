import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { AttendanceCard } from './attendanceCard';
import AttendanceCreateController from './attendanceCreateController';
import AttendanceUpdateController from './attendanceUpdateController';
import AttendanceViewController from './attendanceViewController';
import ATTENDANCE_CONSTANTS from '../constants';
import { useAttendanceTableConfig } from '../hooks/useAttendanceTable';
import { IAttendanceQueryParams, IAttendanceIndex } from '../interface';
import { Heart } from 'lucide-react';

interface AttendanceTableProps {
  setAttendanceCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IAttendanceQueryParams>>;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ setAttendanceCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useAttendanceTableConfig({
    setAttendanceCount,
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
        <MobileCardsView<IAttendanceIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={AttendanceCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.attendanceId || index}
        />
		<AttendanceCreateController />
		<AttendanceUpdateController />
		<AttendanceViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={ATTENDANCE_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <AttendanceCreateController />
	  <AttendanceUpdateController />
	  <AttendanceViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={ATTENDANCE_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default AttendanceTable;