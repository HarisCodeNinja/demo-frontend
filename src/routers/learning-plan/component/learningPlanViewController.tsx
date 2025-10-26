import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getLearningPlanDetails } from '../service';
import LEARNINGPLAN_CONSTANTS from '../constants';

interface ViewProps {}

const LearningPlanViewController: React.FC<ViewProps> = ({}) => {
  const { [LEARNINGPLAN_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: learningPlan, isLoading } = useQuery({
    queryKey: [LEARNINGPLAN_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.learningPlanId, showView],
    queryFn: () => getLearningPlanDetails(primaryKeys?.learningPlanId || 0),
    enabled: Boolean(showView && primaryKeys?.learningPlanId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(LEARNINGPLAN_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && learningPlan && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Learning Plan Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{learningPlan?.data?.learningPlanId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employee Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{learningPlan?.data?.employeeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{learningPlan?.data?.title ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{learningPlan?.data?.description ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{learningPlan?.data?.startDate ? new Date(learningPlan?.data?.startDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{learningPlan?.data?.endDate ? new Date(learningPlan?.data?.endDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{learningPlan?.data?.status ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Assigned By</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{learningPlan?.data?.assignedBy ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{learningPlan?.data?.createdAt ? new Date(learningPlan?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{learningPlan?.data?.updatedAt ? new Date(learningPlan?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${LEARNINGPLAN_CONSTANTS.ENTITY_NAME} Details`}
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

export default LearningPlanViewController;