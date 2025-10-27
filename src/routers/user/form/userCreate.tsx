import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { z } from 'zod';
import USER_CONSTANTS from '../constants';
import { createUserPayloadValidator } from '../validation';
import { FieldError } from '@/components/ErrorMessage';

interface UserFormProps {}

const UserForm: React.FC<UserFormProps> = ({}) => {
  const form = useFormContext<z.infer<typeof createUserPayloadValidator>>();

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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
                    {['admin', 'hr', 'manager', 'employee'].map((option) => (
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
        <div className="text-sm text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </div>
      </div>
    </Form>
  );
};

export default UserForm;
