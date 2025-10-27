import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

import { RootState, useAppSelector } from '@/store';
import { getUserProfile, updateUserProfile } from './service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUserPayloadValidator } from './validation';
import { z } from 'zod';
import { User, Edit3, Save, X, Lock } from 'lucide-react';
import { CleanError, getFieldErrorFromAxios } from '@/util/CleanError';

type ProfileFormData = z.infer<typeof profileUserPayloadValidator>;

const UserProfilePage: React.FC = () => {
  const session = useAppSelector((state: RootState) => state.session);
  const { user, isLoggedIn } = session;
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(session.token),
    enabled: isLoggedIn,
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ profileData, userId }: { profileData: ProfileFormData; userId: string }) => 
      updateUserProfile(profileData, userId),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      // Optionally show success message
      console.log('Profile updated successfully');
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });

  const error = updateProfileMutation.error;

  const navigate = useNavigate();

  const fieldErrors = useMemo(
    () => ({
    email: getFieldErrorFromAxios(error, 'email') || '',
    username: getFieldErrorFromAxios(error, 'username') || '',
    password: getFieldErrorFromAxios(error, 'password') || '',
    role: getFieldErrorFromAxios(error, 'role') || ''
    }),
    [error],
  );

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileUserPayloadValidator),
    defaultValues: profileData?.data || {},
    mode: 'onChange',
  });

  const formErrors = form.formState.errors;
  const hasZodEmailError = !!formErrors.email;
  const hasZodUsernameError = !!formErrors.username;
  const hasZodPasswordError = !!formErrors.password;
  const hasZodRoleError = !!formErrors.role;

  useEffect(() => {
    if (profileData && !isEditing) {
      form.reset(profileData?.data);
    }
  }, [profileData, isEditing, form]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/userLogin');
    }
  }, [isLoggedIn, navigate]);

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
    if (hasZodRoleError) {
      fieldErrors.role = '';
    }
  }, [hasZodEmailError, hasZodUsernameError, hasZodPasswordError, hasZodRoleError, updateProfileMutation]);

  const handleFinish = async (values: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync({ profileData: values, userId: user?.userId || '' });
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      form.handleSubmit(handleFinish)();
    }
    // If not editing, do nothing (prevent submission)
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Ensure form is ready for editing
    if (profileData) {
      form.reset(profileData.data);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profileData) {
      form.reset(profileData.data);
    }
  };

  const ErrorMessage: React.FC<{ message: string }> = React.memo(({ message }) => <p className="text-sm font-medium text-destructive mt-1">{message}</p>);

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information Card */}
        <div className="lg:col-span-2">
          <Card className={isEditing ? 'ring-2 ring-blue-200' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
                {isEditing && <span className="text-sm text-info font-normal">(Editing)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">{CleanError(error)}</div>}
              <Form {...form}>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={!isEditing || !true ? 'pointer-events-none' : ''}>
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
</div>
<div className={!isEditing || !true ? 'pointer-events-none' : ''}>
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
</div>
<div className={!isEditing || !true ? 'pointer-events-none' : ''}>
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
</div>
<div className={!isEditing || !true ? 'pointer-events-none' : ''}>
<FormField
                    control={form.control}
                    name="role"
                    render={({ field: fieldProps }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Select onValueChange={fieldProps.onChange} value={fieldProps.value || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["admin", "hr", "manager", "employee"].map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            </FormControl>
                            
                            <FormMessage />
                        </FormItem>
                    )}
                />
</div>

                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    {!isEditing ? (
                      <Button type="button" onClick={handleEdit} className="flex items-center gap-2" variant="outline">
                        <Edit3 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button 
                          type="button"  // Not type="submit"
                          onClick={() => form.handleSubmit(handleFinish)()}
                          className="flex items-center gap-2" 
                          disabled={updateProfileMutation.isPending || !form.formState.isValid}
                        >
                          <Save className="h-4 w-4" />
                          {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCancel} 
                          className="flex items-center gap-2"
                          disabled={updateProfileMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Security Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="p-4 border rounded-lg bg-muted/30">
                 <div className="space-y-3">
                   <div>
                     <h3 className="font-medium text-foreground">Change Password</h3>
                     <p className="text-sm text-muted-foreground mt-1">Update your password</p>
                   </div>
                   <Button 
                     variant="outline" 
                     onClick={() => navigate('/userChangePassword')}
                     className="hover:bg-muted"
                   >
                     Change Password
                   </Button>
                 </div>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
