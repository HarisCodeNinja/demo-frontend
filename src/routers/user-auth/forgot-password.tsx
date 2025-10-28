import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { CleanError } from '@/util/CleanError';
import { handleApiFormErrors } from '@/util/handleApiFormErrors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { userForgotPassword } from './service';
import { forgotPasswordUserPayloadValidator } from './validation';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordUserPayloadValidator>;

const UserForgotPasswordPage: React.FC = () => {
  const [rateLimited, setRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | undefined>();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordUserPayloadValidator),
    defaultValues: {
      email: '',
    },
  });

  const userForgotPasswordMutation = useMutation({
    mutationFn: userForgotPassword,
    onSuccess: () => {
      setRateLimited(false);
      form.reset();
      toast.success('Password reset email sent successfully!');
    },
    onError: (error: any) => {
      // Check if it's a rate limit error
      if (error?.response?.status === 429) {
        setRateLimited(true);
        // Extract retry-after header if available
        const retryAfter = error.response.headers?.['retry-after'];
        if (retryAfter) {
          setRemainingTime(parseInt(retryAfter));
        }
        toast.error('Too many requests. Please wait before trying again.');
      } else {
        toast.error(CleanError(error));
      }
    },
  });

  const handleFinish = async (values: ForgotPasswordFormData) => {
    try {
      await userForgotPasswordMutation.mutateAsync(values.email);
    } catch (error) {
      handleApiFormErrors(error, form);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-5">
      <Card className="w-full max-w-sm">
        <CardHeader className="">
          <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFinish)} className="flex flex-col gap-4">
              {rateLimited && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Too many password reset requests. Please wait before trying again.
                    {remainingTime && (
                      <span className="block mt-1 text-sm">
                        Try again in {Math.floor(remainingTime / 60)}m {remainingTime % 60}s
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={userForgotPasswordMutation.isPending}>
                {userForgotPasswordMutation.isPending && <Spinner />}
                Send Reset Link
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Back to{' '}
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

export default UserForgotPasswordPage;
