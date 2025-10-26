import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getJobLevelDetails } from '../service';
import JOBLEVEL_CONSTANTS from '../constants';

interface ViewProps {}

const JobLevelViewController: React.FC<ViewProps> = ({}) => {
  const { [JOBLEVEL_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: jobLevel, isLoading } = useQuery({
    queryKey: [JOBLEVEL_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.jobLevelId, showView],
    queryFn: () => getJobLevelDetails(primaryKeys?.jobLevelId || 0),
    enabled: Boolean(showView && primaryKeys?.jobLevelId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(JOBLEVEL_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && jobLevel && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Job Level Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobLevel?.data?.jobLevelId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Level Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobLevel?.data?.levelName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobLevel?.data?.description ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobLevel?.data?.createdAt ? new Date(jobLevel?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobLevel?.data?.updatedAt ? new Date(jobLevel?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${JOBLEVEL_CONSTANTS.ENTITY_NAME} Details`}
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

export default JobLevelViewController;