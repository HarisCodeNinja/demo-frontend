import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { ApiErrorResponse } from '@/types/api';

// Universal form error handler
export function handleApiFormErrors<T extends FieldValues>(error: unknown, form: UseFormReturn<T>) {
  const apiError = (error as { response?: { data?: ApiErrorResponse<string> } }).response?.data;

  if (apiError?.errors?.length) {
    apiError.errors.forEach((e) => {
      form.setError(e.field as Path<T>, { message: e.message });
    });
  }
}
