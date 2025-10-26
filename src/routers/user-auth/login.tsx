import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setSession } from '@/store/slice/sessionSlice';
import { userLogin } from './service';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CleanError } from '@/util/CleanError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginUserPayloadValidator } from './validation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type LoginFormData = z.infer<typeof loginUserPayloadValidator>;

const UserLoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state: RootState) => state.session);
  const { isLoggedIn } = session;

  const userLoginMutation = useMutation({ mutationFn: userLogin });

  const isLoading = userLoginMutation.isPending;
  const error = userLoginMutation.error;

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginUserPayloadValidator),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const handleFinish = useCallback(async (values: LoginFormData) => {
    const response = await userLoginMutation.mutateAsync(values);
    if (response) {
      const result = response.data;
      dispatch(
        setSession({
          ...session,
          token: result.token,
          user: result.user,
          isLoggedIn: true,
          refreshToken: result.refreshToken,
        }),
      );
      navigate(from, { replace: true });
    }
  }, [userLoginMutation, dispatch, session, navigate, from]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm">
        <CardHeader className="">
          <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
          <p className="text-sm text-muted-foreground">Enter your email below to login to your account</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFinish)} className="flex flex-col gap-4">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                  {CleanError(error)}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Email" {...fieldProps} />
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
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      <div className="flex justify-end text-sm">
                        <Link to="/userForgotPassword" className="text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="Enter Password" {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/userRegister" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLoginPage;