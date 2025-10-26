import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getSkillEditDetails, updateSkill } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateSkillPayloadValidator } from '../validation';
import { ISkillEdit } from '../interface';
import SkillUpdateForm from '../form/skillUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import SKILL_CONSTANTS from '../constants';


const SkillUpdateDrawer: React.FC = () => {
  const { [SKILL_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: skillResponse, isLoading: isLoadingSkill } = useQuery({
    queryKey: [SKILL_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.skillId, showEdit],
    queryFn: () => getSkillEditDetails(primaryKeys?.skillId || 0),
    enabled: Boolean(showEdit && primaryKeys?.skillId),
  });


  const updateSkillMutation = useMutation({
    mutationFn: updateSkill,
  });

  const isLoading = isLoadingSkill || updateSkillMutation.isPending;
  const form = useForm<z.infer<typeof updateSkillPayloadValidator>>({
  resolver: zodResolver(updateSkillPayloadValidator),
  defaultValues: getDefaultFormValues(updateSkillPayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (skillResponse?.data) {
      form.reset(skillResponse.data);
    }
  }, [skillResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateSkillPayloadValidator>) => {
    try {
      await updateSkillMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [SKILL_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateSkillMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateSkillPayloadValidator));
  dispatch(resetSelectedObj(SKILL_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${SKILL_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={600} loading={isLoading}>
  <FormProvider {...form}>
    <SkillUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default SkillUpdateDrawer;
