import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getUserEditDetails, updateUser } from '../service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateUserPayloadValidator } from '../validation';
import { IUserEdit } from '../interface';
import UserUpdateForm from '../form/userUpdate';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { FormProvider } from 'react-hook-form';
import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import USER_CONSTANTS from '../constants';


const UserUpdateDrawer: React.FC = () => {
  const { [USER_CONSTANTS.ENTITY_KEY]: { showEdit, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const { data: userResponse, isLoading: isLoadingUser } = useQuery({
    queryKey: [USER_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.userId, showEdit],
    queryFn: () => getUserEditDetails(primaryKeys?.userId || 0),
    enabled: Boolean(showEdit && primaryKeys?.userId),
  });


  const updateUserMutation = useMutation({
    mutationFn: updateUser,
  });

  const isLoading = isLoadingUser || updateUserMutation.isPending;
  const form = useForm<z.infer<typeof updateUserPayloadValidator>>({
  resolver: zodResolver(updateUserPayloadValidator),
  defaultValues: getDefaultFormValues(updateUserPayloadValidator),
  mode: 'onChange',
});

  useEffect(() => {
    if (userResponse?.data) {
      form.reset(userResponse.data);
    }
  }, [userResponse, form]);

  const updateData = React.useCallback(
  async (data: z.infer<typeof updateUserPayloadValidator>) => {
    try {
      await updateUserMutation.mutateAsync({ ...data, ...primaryKeys });
      queryClient.invalidateQueries({ queryKey: [USER_CONSTANTS.QUERY_KEY], exact: false });
      handleCloseDrawer();
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  },
  [updateUserMutation, primaryKeys, queryClient, form],
);

  const handleCloseDrawer = React.useCallback(() => {
  form.reset(getDefaultFormValues(updateUserPayloadValidator));
  dispatch(resetSelectedObj(USER_CONSTANTS.ENTITY_KEY));
}, [form, dispatch]);

  return (
    <Controls title={`Edit ${USER_CONSTANTS.ENTITY_NAME}`} open={showEdit} onClose={handleCloseDrawer} form={form} onSubmit={updateData} type="drawer" width={800} loading={isLoading}>
  <FormProvider {...form}>
    <UserUpdateForm />
  </FormProvider>
</Controls>
  );
};

export default UserUpdateDrawer;
