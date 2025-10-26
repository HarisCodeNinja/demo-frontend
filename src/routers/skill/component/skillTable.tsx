import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { SkillCard } from './skillCard';
import SkillCreateController from './skillCreateController';
import SkillUpdateController from './skillUpdateController';
import SkillViewController from './skillViewController';
import SKILL_CONSTANTS from '../constants';
import { useSkillTableConfig } from '../hooks/useSkillTable';
import { ISkillQueryParams, ISkillIndex } from '../interface';
import { Heart } from 'lucide-react';

interface SkillTableProps {
  setSkillCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<ISkillQueryParams>>;
}

const SkillTable: React.FC<SkillTableProps> = ({ setSkillCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useSkillTableConfig({
    setSkillCount,
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
        <MobileCardsView<ISkillIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={SkillCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.skillId || index}
        />
		<SkillCreateController />
		<SkillUpdateController />
		<SkillViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={SKILL_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <SkillCreateController />
	  <SkillUpdateController />
	  <SkillViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={SKILL_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default SkillTable;