import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getLocationDetails } from '../service';
import LOCATION_CONSTANTS from '../constants';

interface ViewProps {}

const LocationViewController: React.FC<ViewProps> = ({}) => {
  const { [LOCATION_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: location, isLoading } = useQuery({
    queryKey: [LOCATION_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.locationId, showView],
    queryFn: () => getLocationDetails(primaryKeys?.locationId || 0),
    enabled: Boolean(showView && primaryKeys?.locationId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(LOCATION_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && location && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Location Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{location?.data?.locationId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Location Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{location?.data?.locationName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{location?.data?.createdAt ? new Date(location?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{location?.data?.updatedAt ? new Date(location?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${LOCATION_CONSTANTS.ENTITY_NAME} Details`}
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

export default LocationViewController;