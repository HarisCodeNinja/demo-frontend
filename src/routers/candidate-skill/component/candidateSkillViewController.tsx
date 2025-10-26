import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getCandidateSkillDetails } from '../service';
import CANDIDATESKILL_CONSTANTS from '../constants';

interface ViewProps {}

const CandidateSkillViewController: React.FC<ViewProps> = ({}) => {
  const { [CANDIDATESKILL_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: candidateSkill, isLoading } = useQuery({
    queryKey: [CANDIDATESKILL_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.candidateSkillId, showView],
    queryFn: () => getCandidateSkillDetails(primaryKeys?.candidateSkillId || 0),
    enabled: Boolean(showView && primaryKeys?.candidateSkillId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(CANDIDATESKILL_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && candidateSkill && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Candidate Skill Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidateSkill?.data?.candidateSkillId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Candidate Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidateSkill?.data?.candidateId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Skill Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidateSkill?.data?.skillId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Proficiency</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidateSkill?.data?.proficiency ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidateSkill?.data?.createdAt ? new Date(candidateSkill?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{candidateSkill?.data?.updatedAt ? new Date(candidateSkill?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${CANDIDATESKILL_CONSTANTS.ENTITY_NAME} Details`}
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

export default CandidateSkillViewController;