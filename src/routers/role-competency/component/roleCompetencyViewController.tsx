import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getRoleCompetencyDetails } from '../service';
import ROLECOMPETENCY_CONSTANTS from '../constants';

interface ViewProps {}

const RoleCompetencyViewController: React.FC<ViewProps> = ({}) => {
  const { [ROLECOMPETENCY_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: roleCompetency, isLoading } = useQuery({
    queryKey: [ROLECOMPETENCY_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.roleCompetencyId, showView],
    queryFn: () => getRoleCompetencyDetails(primaryKeys?.roleCompetencyId || 0),
    enabled: Boolean(showView && primaryKeys?.roleCompetencyId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(ROLECOMPETENCY_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && roleCompetency && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Role Competency Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{roleCompetency?.data?.roleCompetencyId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Designation Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{roleCompetency?.data?.designationId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Competency Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{roleCompetency?.data?.competencyId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Required Proficiency</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{roleCompetency?.data?.requiredProficiency ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{roleCompetency?.data?.createdAt ? new Date(roleCompetency?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{roleCompetency?.data?.updatedAt ? new Date(roleCompetency?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${ROLECOMPETENCY_CONSTANTS.ENTITY_NAME} Details`}
      open={showView}
      onClose={handleClose}
      type="modal"
      width={800}
      loading={isLoading}
    >
      <Content />
    </Controls>
  );
};

export default RoleCompetencyViewController;