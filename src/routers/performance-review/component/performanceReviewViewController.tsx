import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getPerformanceReviewDetails } from '../service';
import PERFORMANCEREVIEW_CONSTANTS from '../constants';

interface ViewProps {}

const PerformanceReviewViewController: React.FC<ViewProps> = ({}) => {
  const { [PERFORMANCEREVIEW_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: performanceReview, isLoading } = useQuery({
    queryKey: [PERFORMANCEREVIEW_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.performanceReviewId, showView],
    queryFn: () => getPerformanceReviewDetails(primaryKeys?.performanceReviewId || 0),
    enabled: Boolean(showView && primaryKeys?.performanceReviewId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(PERFORMANCEREVIEW_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && performanceReview && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Performance Review Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.performanceReviewId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employee Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.employeeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Reviewer Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.reviewerId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Review Period</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.reviewPeriod ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Review Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.reviewDate ? new Date(performanceReview?.data?.reviewDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Self Assessment</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.selfAssessment ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Manager Feedback</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.managerFeedback ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Overall Rating</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.overallRating ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Recommendation</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.recommendation ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.status ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.createdAt ? new Date(performanceReview?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{performanceReview?.data?.updatedAt ? new Date(performanceReview?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${PERFORMANCEREVIEW_CONSTANTS.ENTITY_NAME} Details`}
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

export default PerformanceReviewViewController;