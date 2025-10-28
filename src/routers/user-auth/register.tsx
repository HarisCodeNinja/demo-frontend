import { Alert, AlertDescription, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setSession } from '@/store/slice/sessionSlice';
import { CleanError } from '@/util/CleanError';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { userRegister } from './service';
import { registerUserPayloadValidator } from './validation';

import { toast } from 'sonner';
import { getDefaultFormValues } from '@/util/getDefaultFormValues';

type RegistrationFormData = z.infer<typeof registerUserPayloadValidator>;

const UserRegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state: RootState) => state.session);
  const { isLoggedIn } = session;
  const userRegisterMutation = useMutation({ mutationFn: userRegister });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registerUserPayloadValidator),
    defaultValues: getDefaultFormValues(registerUserPayloadValidator),
  });

  const handleFinish = useCallback(
    async (values: RegistrationFormData) => {
      try {
        const response = await userRegisterMutation.mutateAsync(values);
        if (response) {
          const result = response.data;
          dispatch(
            setSession({
              ...session,
              token: result.token,
              user: result.user,
              isLoggedIn: true,
            }),
          );
          navigate(from, { replace: true });
        }
      } catch (error) {
        toast.error(CleanError(error));
        handleApiFormErrors(error, form);
      }
    },
    [userRegisterMutation, dispatch, session, navigate, from],
  );

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  return (
    <div className="flex items-center justify-center py-12 px-5">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription className="">Join thousands of developers building amazing applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFinish)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter Email" {...fieldProps} value={fieldProps.value?.toString() || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter Username" {...fieldProps} value={fieldProps.value?.toString() || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter Password" {...fieldProps} value={fieldProps.value?.toString() || ''} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={userRegisterMutation.isPending}>
                {userRegisterMutation.isPending && <Spinner />}
                Register
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/userLogin" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegisterPage;
