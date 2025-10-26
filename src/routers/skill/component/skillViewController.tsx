import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getSkillDetails } from '../service';
import SKILL_CONSTANTS from '../constants';

interface ViewProps {}

const SkillViewController: React.FC<ViewProps> = ({}) => {
  const { [SKILL_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: skill, isLoading } = useQuery({
    queryKey: [SKILL_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.skillId, showView],
    queryFn: () => getSkillDetails(primaryKeys?.skillId || 0),
    enabled: Boolean(showView && primaryKeys?.skillId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(SKILL_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && skill && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Skill Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{skill?.data?.skillId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Skill Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{skill?.data?.skillName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{skill?.data?.createdAt ? new Date(skill?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{skill?.data?.updatedAt ? new Date(skill?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${SKILL_CONSTANTS.ENTITY_NAME} Details`}
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

export default SkillViewController;