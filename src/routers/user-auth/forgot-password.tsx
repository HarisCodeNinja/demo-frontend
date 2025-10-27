import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { forgotPasswordUserPayloadValidator } from './validation';
import { CleanError } from '@/util/CleanError';
import { toast } from 'sonner';
import { userForgotPassword } from './service';
import { useMutation } from '@tanstack/react-query';


type ForgotPasswordFormData = z.infer<typeof forgotPasswordUserPayloadValidator>;

const UserForgotPasswordPage: React.FC = () => {
	const [emailSent, setEmailSent] = useState(false);
	const [rateLimited, setRateLimited] = useState(false);
	const [remainingTime, setRemainingTime] = useState<number | undefined>();
	
	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordUserPayloadValidator),
		defaultValues: {
			email: '',
		},
		mode: 'onChange',
	});

	const userForgotPasswordMutation = useMutation({
    mutationFn: userForgotPassword,
    onSuccess: () => {
        setEmailSent(true);
        setRateLimited(false);
        toast.success('Password reset email sent successfully!');
    },
    onError: (error: any) => {
        console.error('Password reset request failed:', error);
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
    }
});

const isLoading = userForgotPasswordMutation.isPending;
const error = userForgotPasswordMutation.error;
const isSuccess = userForgotPasswordMutation.isSuccess;

const handleFinish = async (values: ForgotPasswordFormData) => {
    try {
        await userForgotPasswordMutation.mutateAsync(values.email);
    } catch (error) {
        // Error is handled by the mutation's onError callback
        console.error('Failed to send password reset email:', error);
    }
};

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
					<CardDescription>
						Enter your email address and we'll send you a link to reset your password.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{emailSent || isSuccess ? (
						<div className="text-center space-y-4">
							<div className="flex justify-center">
								<div className="size-12 bg-success/15 rounded-full flex items-center justify-center">
									<svg className="size-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="text-lg font-semibold text-success">Email Sent Successfully</h3>
								<p className="text-success">A password reset link has been sent to your email address. Please check your inbox and follow the instructions to reset your password.</p>
							</div>
							<div className="pt-4">
								<Link to="/userLogin" className="inline-flex items-center text-primary hover:underline">
									<svg className="size-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
									</svg>
									Back to Login
								</Link>
							</div>
						</div>
					) : (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleFinish)} className="flex flex-col gap-4">
								{rateLimited ? (
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
								) : error && (
									<Alert variant="destructive">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>
											{CleanError(error)}
										</AlertDescription>
									</Alert>
								)}

								<FormField
									control={form.control}
									name="email"
									render={({ field: fieldProps }) => (
										<FormItem>
											<FormLabel>Email Address</FormLabel>
											<FormControl>
												<div className="relative">
													<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
													<Input
														placeholder="Enter your email"
														className="ps-10"
														{...fieldProps}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button 
									type="submit" 
									className="w-full" 
									disabled={isLoading || rateLimited}
								>
									{isLoading ? 'Sending...' : 'Send Reset Link'}
								</Button>

								<div className="text-center text-sm text-muted-foreground">
									<Link to="/userLogin" className="text-primary hover:underline">
										Back to Login
									</Link>
								</div>
							</form>
						</Form>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default UserForgotPasswordPage;
