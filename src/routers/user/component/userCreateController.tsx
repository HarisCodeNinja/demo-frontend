import React from 'react';
	import { FormProvider, useForm } from 'react-hook-form';
	import { zodResolver } from '@hookform/resolvers/zod';
	import { z } from 'zod';
	import { useMutation, useQueryClient } from '@tanstack/react-query';
	
	import { addUser } from '../service';
	import { createUserPayloadValidator } from '../validation';
	import { IUserAdd } from '../interface';
	import { RootState, useAppDispatch, useAppSelector } from '@/store';
	import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
	import { getDefaultFormValues } from '@/util/getFormDefaultFormValues';
	import { handleApiFormErrors } from '@/util/handleApiFormErrors';
	import USER_CONSTANTS from '../constants';
	
	import Controls from '@/components/Wrapper/controls';
	import UserForm from '../form/userCreate';

type CreateUserFormData = z.infer<typeof createUserPayloadValidator>;

const UserCreateDrawer: React.FC = () => {
  const { [USER_CONSTANTS.ENTITY_KEY]: { showForm = false } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    mutationFn: addUser,
  });

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserPayloadValidator),
    defaultValues: getDefaultFormValues(createUserPayloadValidator),
    mode: 'onChange',
  });

  const handleSubmit = React.useCallback(
    async (data: CreateUserFormData) => {
      try {
        await addUserMutation.mutateAsync(data as IUserAdd);
        queryClient.invalidateQueries({ queryKey: [USER_CONSTANTS.QUERY_KEY], exact: false });
        handleCloseDrawer();
      } catch (error) {
        handleApiFormErrors(error, form);
      }
    },
    [addUserMutation, queryClient, form],
  );

  const handleCloseDrawer = React.useCallback(() => {
    form.reset(getDefaultFormValues(createUserPayloadValidator));
    dispatch(resetSelectedObj(USER_CONSTANTS.ENTITY_KEY));
  }, [form, dispatch]);

  React.useEffect(() => {
    if (showForm) {
      form.reset(getDefaultFormValues(createUserPayloadValidator));
    }
  }, [showForm, form]);

  React.useEffect(() => {
    return () => {
      if (addUserMutation.isSuccess || addUserMutation.isError) {
        addUserMutation.reset();
      }
    };
  }, [addUserMutation]);

  return (
  <Controls title={`Create ${USER_CONSTANTS.ENTITY_NAME}`} open={showForm} onClose={handleCloseDrawer} form={form} onSubmit={handleSubmit} type="drawer" width={800} loading={addUserMutation.isPending}>
    <FormProvider {...form}>
      <UserForm />
    </FormProvider>
  </Controls>
);
};

export default UserCreateDrawer;
