import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getUserDetails } from '../service';
import USER_CONSTANTS from '../constants';

interface ViewProps {}

const UserViewController: React.FC<ViewProps> = ({}) => {
  const { [USER_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: user, isLoading } = useQuery({
    queryKey: [USER_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.userId, showView],
    queryFn: () => getUserDetails(primaryKeys?.userId || 0),
    enabled: Boolean(showView && primaryKeys?.userId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(USER_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && user && (
        <div className="grid grid-cols-1 gap-6 items-start">
          {/* <div className="space-y-2">
          <Label>User Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{user?.data?.userId ?? '-'}</div>
        </div> */}
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex items-center text-sm bg-muted p-3 rounded-md">{user?.data?.email ?? '-'}</div>
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <div className="flex items-center text-sm bg-muted p-3 rounded-md">{user?.data?.username ?? '-'}</div>
          </div>
          {/* <div className="space-y-2">
            <Label>Password</Label>
            <div className="flex items-center text-sm bg-muted p-3 rounded-md">{user?.data?.password ?? '-'}</div>
          </div> */}
          <div className="space-y-2">
            <Label>Role</Label>
            <div className="flex items-center text-sm bg-muted p-3 rounded-md">{user?.data?.role ?? '-'}</div>
          </div>
          <div className="space-y-2">
            <Label>Created At</Label>
            <div className="flex items-center text-sm bg-muted p-3 rounded-md">{user?.data?.createdAt ? new Date(user?.data?.createdAt).toLocaleDateString() : '-'}</div>
          </div>
          <div className="space-y-2">
            <Label>Updated At</Label>
            <div className="flex items-center text-sm bg-muted p-3 rounded-md">{user?.data?.updatedAt ? new Date(user?.data?.updatedAt).toLocaleDateString() : '-'}</div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <Controls title={`${USER_CONSTANTS.ENTITY_NAME} Details`} open={showView} onClose={handleClose} type="modal" width={800} loading={isLoading}>
      <Content />
    </Controls>
  );
};

export default UserViewController;
