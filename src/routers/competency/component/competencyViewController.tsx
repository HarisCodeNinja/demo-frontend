import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getCompetencyDetails } from '../service';
import COMPETENCY_CONSTANTS from '../constants';

interface ViewProps {}

const CompetencyViewController: React.FC<ViewProps> = ({}) => {
  const { [COMPETENCY_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: competency, isLoading } = useQuery({
    queryKey: [COMPETENCY_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.competencyId, showView],
    queryFn: () => getCompetencyDetails(primaryKeys?.competencyId || 0),
    enabled: Boolean(showView && primaryKeys?.competencyId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(COMPETENCY_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && competency && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Competency Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{competency?.data?.competencyId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Competency Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{competency?.data?.competencyName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{competency?.data?.description ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{competency?.data?.createdAt ? new Date(competency?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{competency?.data?.updatedAt ? new Date(competency?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${COMPETENCY_CONSTANTS.ENTITY_NAME} Details`}
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

export default CompetencyViewController;