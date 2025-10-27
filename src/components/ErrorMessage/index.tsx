import React from 'react';
import { FieldErrors, FieldError as RHFFieldError } from 'react-hook-form';
import { CleanError } from '@/util/CleanError';

interface ErrorSummaryProps {
  error?: Error | null;
  className?: string;
}

interface FieldErrorProps {
  errors: FieldErrors<any>;
  fieldName: string;
  className?: string;
}

export const ErrorSummary: React.FC<ErrorSummaryProps> = ({ error, className = "" }) => {
  if (!error) return null;

  return (
    <div className={`mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm ${className}`}>
      {CleanError(error)}
    </div>
  );
};

export const FieldError: React.FC<FieldErrorProps> = ({ errors, fieldName, className = "" }) => {
  const error = errors[fieldName] as RHFFieldError | undefined;
  
  if (!error) return null;

  return (
    <p className={`text-sm font-medium text-destructive mt-1 ${className}`}>
      {error.message || 'This field is required'}
    </p>
  );
};
