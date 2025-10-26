import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getJobOpeningDetails } from '../service';
import JOBOPENING_CONSTANTS from '../constants';

interface ViewProps {}

const JobOpeningViewController: React.FC<ViewProps> = ({}) => {
  const { [JOBOPENING_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: jobOpening, isLoading } = useQuery({
    queryKey: [JOBOPENING_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.jobOpeningId, showView],
    queryFn: () => getJobOpeningDetails(primaryKeys?.jobOpeningId || 0),
    enabled: Boolean(showView && primaryKeys?.jobOpeningId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(JOBOPENING_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && jobOpening && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Job Opening Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.jobOpeningId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.title ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.description ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Department Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.departmentId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Designation Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.designationId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Location Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.locationId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Required Experience</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.requiredExperience ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.status ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Published At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.publishedAt ? new Date(jobOpening?.data?.publishedAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Closed At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.closedAt ? new Date(jobOpening?.data?.closedAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created By</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.createdBy ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.createdAt ? new Date(jobOpening?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpening?.data?.updatedAt ? new Date(jobOpening?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${JOBOPENING_CONSTANTS.ENTITY_NAME} Details`}
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

export default JobOpeningViewController;