import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface FormFieldWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  children: (field: any) => React.ReactNode;
  required?: boolean;
  description?: string;
  className?: string;
}

const FormFieldWrapper = <T extends FieldValues>({
  control,
  name,
  label,
  children,
  required = false,
  description,
  className,
}: FormFieldWrapperProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn("space-y-2", className)}>
          <FormLabel className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            "flex items-center gap-1",
            fieldState.error && "text-destructive"
          )}>
            {label}
            {required && (
              <span className="text-destructive text-xs" aria-label="required">
                *
              </span>
            )}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {children(field)}
            </div>
          </FormControl>
          {description && !fieldState.error && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default FormFieldWrapper;