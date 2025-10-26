import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { PayslipCard } from './payslipCard';
import PayslipCreateController from './payslipCreateController';
import PayslipUpdateController from './payslipUpdateController';
import PayslipViewController from './payslipViewController';
import PAYSLIP_CONSTANTS from '../constants';
import { usePayslipTableConfig } from '../hooks/usePayslipTable';
import { IPayslipQueryParams, IPayslipIndex } from '../interface';
import { Heart } from 'lucide-react';

interface PayslipTableProps {
  setPayslipCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IPayslipQueryParams>>;
}

const PayslipTable: React.FC<PayslipTableProps> = ({ setPayslipCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = usePayslipTableConfig({
    setPayslipCount,
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
        <MobileCardsView<IPayslipIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={PayslipCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.payslipId || index}
        />
		<PayslipCreateController />
		<PayslipUpdateController />
		<PayslipViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={PAYSLIP_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <PayslipCreateController />
	  <PayslipUpdateController />
	  <PayslipViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={PAYSLIP_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default PayslipTable;