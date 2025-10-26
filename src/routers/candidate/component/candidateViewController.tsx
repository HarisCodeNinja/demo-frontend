import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getCandidateDetails } from '../service';
import CANDIDATE_CONSTANTS from '../constants';

interface ViewProps {}

const CandidateViewController: React.FC<ViewProps> = ({}) => {
  const { [CANDIDATE_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: candidate, isLoading } = useQuery({
    queryKey: [CANDIDATE_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.candidateId, showView],
    queryFn: () => getCandidateDetails(primaryKeys?.candidateId || 0),
    enabled: Boolean(showView && primaryKeys?.candidateId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(CANDIDATE_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && candidate && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Candidate Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.candidateId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>First Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.firstName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.lastName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.email ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.phoneNumber ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Resume Text</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.resumeText ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Source</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.source ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Current Status</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.currentStatus ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Job Opening Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.jobOpeningId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Referred By Employee Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.referredByEmployeeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.createdAt ? new Date(candidate?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidate?.data?.updatedAt ? new Date(candidate?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${CANDIDATE_CONSTANTS.ENTITY_NAME} Details`}
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

export default CandidateViewController;