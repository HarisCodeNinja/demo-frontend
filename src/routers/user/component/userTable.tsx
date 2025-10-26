import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { UserCard } from './userCard';
import UserCreateController from './userCreateController';
import UserUpdateController from './userUpdateController';
import UserViewController from './userViewController';
import USER_CONSTANTS from '../constants';
import { useUserTableConfig } from '../hooks/useUserTable';
import { IUserQueryParams, IUserIndex } from '../interface';
import { Heart } from 'lucide-react';

interface UserTableProps {
  setUserCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IUserQueryParams>>;
}

const UserTable: React.FC<UserTableProps> = ({ setUserCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useUserTableConfig({
    setUserCount,
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
        <MobileCardsView<IUserIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={UserCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.userId || index}
        />
		<UserCreateController />
		<UserUpdateController />
		<UserViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={USER_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <UserCreateController />
	  <UserUpdateController />
	  <UserViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={USER_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default UserTable;