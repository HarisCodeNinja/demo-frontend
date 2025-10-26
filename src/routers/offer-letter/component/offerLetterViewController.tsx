import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getOfferLetterDetails } from '../service';
import OFFERLETTER_CONSTANTS from '../constants';

interface ViewProps {}

const OfferLetterViewController: React.FC<ViewProps> = ({}) => {
  const { [OFFERLETTER_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: offerLetter, isLoading } = useQuery({
    queryKey: [OFFERLETTER_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.offerLetterId, showView],
    queryFn: () => getOfferLetterDetails(primaryKeys?.offerLetterId || 0),
    enabled: Boolean(showView && primaryKeys?.offerLetterId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(OFFERLETTER_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && offerLetter && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Offer Letter Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.offerLetterId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Candidate Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.candidateId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Job Opening Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.jobOpeningId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Salary Offered</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.salaryOffered ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Joining Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.joiningDate ? new Date(offerLetter?.data?.joiningDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Terms And Condition</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.termsAndCondition ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.status ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Issued By</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.issuedBy ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Approved By</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.approvedBy ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.createdAt ? new Date(offerLetter?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{offerLetter?.data?.updatedAt ? new Date(offerLetter?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${OFFERLETTER_CONSTANTS.ENTITY_NAME} Details`}
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

export default OfferLetterViewController;