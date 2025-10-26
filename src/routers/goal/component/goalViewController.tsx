import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getGoalDetails } from '../service';
import GOAL_CONSTANTS from '../constants';

interface ViewProps {}

const GoalViewController: React.FC<ViewProps> = ({}) => {
  const { [GOAL_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: goal, isLoading } = useQuery({
    queryKey: [GOAL_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.goalId, showView],
    queryFn: () => getGoalDetails(primaryKeys?.goalId || 0),
    enabled: Boolean(showView && primaryKeys?.goalId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(GOAL_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && goal && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Goal Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.goalId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employee Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.employeeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.title ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.description ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Kpi</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.kpi ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Period</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.period ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.startDate ? new Date(goal?.data?.startDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.endDate ? new Date(goal?.data?.endDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.status ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Assigned By</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.assignedBy ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.createdAt ? new Date(goal?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{goal?.data?.updatedAt ? new Date(goal?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${GOAL_CONSTANTS.ENTITY_NAME} Details`}
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

export default GoalViewController;