import React, { useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setSession } from '@/store/slice/sessionSlice';
import { userRegister } from './service';
import { useMutation } from '@tanstack/react-query';
import { CleanError, getFieldErrorFromAxios } from '@/util/CleanError';
import defaultObj from './data/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUserPayloadValidator } from './validation';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

type RegistrationFormData = z.infer<typeof registerUserPayloadValidator>;

const UserRegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state: RootState) => state.session);
  const { isLoggedIn } = session;
  const userRegisterMutation = useMutation({ mutationFn: userRegister });

  const isLoading = userRegisterMutation.isPending;
  const error = userRegisterMutation.error;

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const fieldErrors = useMemo(
    () => ({
    email: getFieldErrorFromAxios(error, 'email') || '',
    username: getFieldErrorFromAxios(error, 'username') || '',
    password: getFieldErrorFromAxios(error, 'password') || ''
    }),
    [error],
  );

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registerUserPayloadValidator),
    defaultValues: defaultObj as RegistrationFormData,
    mode: 'onChange',
  });

  const formErrors = form.formState.errors;
  const hasZodEmailError = !!formErrors.email;
  const hasZodUsernameError = !!formErrors.username;
  const hasZodPasswordError = !!formErrors.password;

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
      } catch (err) {
        console.error('Registration error:', err);
      }
    },
    [userRegisterMutation, dispatch, session, navigate, from],
  );

  useEffect(() => {
    if (hasZodEmailError) {
      fieldErrors.email = '';
    }
    if (hasZodUsernameError) {
      fieldErrors.username = '';
    }
    if (hasZodPasswordError) {
      fieldErrors.password = '';
    }
  }, [hasZodEmailError, hasZodUsernameError, hasZodPasswordError, userRegisterMutation]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const ErrorMessage: React.FC<{ message: string }> = React.memo(({ message }) => <p className="text-sm font-medium text-destructive mt-1">{message}</p>);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Join thousands of developers building amazing applications</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">{CleanError(error)}</div>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFinish)} className="flex flex-col gap-4">
			<FormField
			                    control={form.control}
			                    name="email"
			                    render={({ field: fieldProps }) => (
			                        <FormItem>
			                            <FormLabel>Email</FormLabel>
			                            <FormControl>
			                                <Input 
			                                    type="email"
			                                    placeholder="Enter Email"
			                                    {...fieldProps}
                                    
			                                    value={fieldProps.value?.toString() || ''}
			                                />
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
			                                <Input 
			                                    type="text"
			                                    placeholder="Enter Username"
			                                    {...fieldProps}
                                    
			                                    value={fieldProps.value?.toString() || ''}
			                                />
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
			                                <Input 
			                                    type="password"
			                                    placeholder="Enter Password"
			                                    {...fieldProps}
                                    
			                                    value={fieldProps.value?.toString() || ''}
			                                />
			                            </FormControl>
                            
			                            <FormMessage />
			                        </FormItem>
			                    )}
			                />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating' : 'Register'}
              </Button>

              <div className="text-center">
                <Button type="button" variant="link" asChild className="text-sm">
                  <Link to="/userLogin">Already have an account? Sign in</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegisterPage;