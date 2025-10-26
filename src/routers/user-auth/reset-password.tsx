import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordRequirements } from '@/components/ui/password-requirements';
import { toast } from 'sonner';
import { resetPasswordUserPayloadValidator } from './validation';
import { CleanError } from '@/util/CleanError';
import { userResetPassword } from './service';
import { useMutation } from '@tanstack/react-query';


type ResetPasswordFormData = z.infer<typeof resetPasswordUserPayloadValidator>;

const UserResetPasswordPage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [passwordReset, setPasswordReset] = useState(false);

	const token = searchParams.get('token');

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordUserPayloadValidator),
		defaultValues: {
			token: token || '',
			newPassword: '',
			confirmPassword: '',
		},
		mode: 'onChange',
	});

	// Watch the newPassword field for requirements display
	const newPassword = form.watch('newPassword');
	
	// Check if password is invalid for visual feedback
	const isPasswordInvalid = Boolean(newPassword && !isPasswordValid(newPassword));
	
	// Helper function to check password validity
	function isPasswordValid(password: string): boolean {
		return password.length >= 8 && 
			   /[a-z]/.test(password) && 
			   /[A-Z]/.test(password) && 
			   /\d/.test(password) && 
			   /[@$!%*?&]/.test(password);
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
        setPasswordReset(true);
        toast.success('Password reset successfully!');
    },
    onError: (error) => {
        console.error('Password reset failed:', error);
        toast.error(CleanError(error));
    }
});

const isLoading = userResetPasswordMutation.isPending;
const error = userResetPasswordMutation.error;
const isSuccess = userResetPasswordMutation.isSuccess;

const handleFinish = async (values: ResetPasswordFormData) => {
    try {
        await userResetPasswordMutation.mutateAsync(values);
    } catch (error) {
        // Error is handled by the mutation's onError callback
        console.error('Failed to reset password:', error);
    }
};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
					<CardDescription>
						Enter your new password below.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{passwordReset || isSuccess ? (
						<div className="text-center space-y-4">
							<div className="flex justify-center">
								<div className="size-12 bg-green-100 rounded-full flex items-center justify-center">
									<svg className="size-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="text-lg font-semibold text-green-800">Password Reset Successful</h3>
								<p className="text-green-700">Your password has been successfully reset. You can now log in with your new password.</p>
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
								{error && (
									<Alert variant="destructive">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>
											{CleanError(error)}
										</AlertDescription>
									</Alert>
								)}

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
													disabled={isLoading}
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
												<PasswordInput
													value={fieldProps.value}
													onChange={fieldProps.onChange}
													placeholder="Confirm new password"
													disabled={isLoading}
													aria-label="Confirm new password"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? 'Resetting...' : 'Reset Password'}
								</Button>
							</form>
						</Form>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default UserResetPasswordPage;
