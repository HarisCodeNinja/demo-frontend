import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getJobOpeningSkillDetails } from '../service';
import JOBOPENINGSKILL_CONSTANTS from '../constants';

interface ViewProps {}

const JobOpeningSkillViewController: React.FC<ViewProps> = ({}) => {
  const { [JOBOPENINGSKILL_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: jobOpeningSkill, isLoading } = useQuery({
    queryKey: [JOBOPENINGSKILL_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.jobOpeningSkillId, showView],
    queryFn: () => getJobOpeningSkillDetails(primaryKeys?.jobOpeningSkillId || 0),
    enabled: Boolean(showView && primaryKeys?.jobOpeningSkillId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(JOBOPENINGSKILL_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && jobOpeningSkill && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Job Opening Skill Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpeningSkill?.data?.jobOpeningSkillId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Job Opening Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpeningSkill?.data?.jobOpeningId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Skill Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpeningSkill?.data?.skillId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Required Level</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpeningSkill?.data?.requiredLevel ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpeningSkill?.data?.createdAt ? new Date(jobOpeningSkill?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{jobOpeningSkill?.data?.updatedAt ? new Date(jobOpeningSkill?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${JOBOPENINGSKILL_CONSTANTS.ENTITY_NAME} Details`}
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

export default JobOpeningSkillViewController;