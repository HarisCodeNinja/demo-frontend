import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordRequirements } from '@/components/ui/password-requirements';
import { Spinner } from '@/components/ui/spinner';
import { CleanError } from '@/util/CleanError';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { userResetPassword } from './service';
import { resetPasswordUserPayloadValidator } from './validation';

type ResetPasswordFormData = z.infer<typeof resetPasswordUserPayloadValidator>;

const UserResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordUserPayloadValidator),
    defaultValues: {
      token: token || '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Watch the newPassword field for requirements display
  const newPassword = form.watch('newPassword');

  // Check if password is invalid for visual feedback
  const isPasswordInvalid = Boolean(newPassword && !isPasswordValid(newPassword));

  // Helper function to check password validity
  function isPasswordValid(password: string): boolean {
    return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password);
  }

  useEffect(() => {
    if (!token || token.length < 10) {
      // Redirect to login if token is missing or invalid
      navigate('/userLogin', { replace: true });
    }
  }, [token, navigate]);

  const userResetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) => userResetPassword(data.token, data.newPassword),
    onSuccess: () => {
      form.reset();
      toast.success('Password reset successfully!');
    },
    onError: (error) => {
      toast.error(CleanError(error));
    },
  });

  const handleFinish = async (values: ResetPasswordFormData) => {
    try {
      await userResetPasswordMutation.mutateAsync(values);
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error('Failed to reset password:', error);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-5">
      <Card className="w-full max-w-sm">
        <CardHeader className="">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFinish)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        value={fieldProps.value}
                        onChange={fieldProps.onChange}
                        placeholder="Enter new password"
                        aria-label="New password"
                        hasError={isPasswordInvalid}
                      />
                    </FormControl>
                    <FormMessage />
                    <PasswordRequirements password={newPassword} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput value={fieldProps.value} onChange={fieldProps.onChange} placeholder="Confirm new password" aria-label="Confirm new password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={userResetPasswordMutation.isPending}>
                {userResetPasswordMutation.isPending && <Spinner />}
                Reset Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserResetPasswordPage;
