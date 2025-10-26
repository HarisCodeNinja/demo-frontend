interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ErrorResponse {
  success: boolean;
  error: string;
  message: string;
  errors: ValidationError[];
  timestamp: string;
}

export const CleanError = (error: any): string => {
    // Handle React Query mutation errors (Axios errors)
    if (error && error.response && error.response.data) {
        const responseData = error.response.data;
        return responseData.message || 'An error occurred';
    }
    // Handle direct error objects with data property
    else if (error && 'data' in error) {
        let err = error.data as any;
        return err.message || 'An error occurred';
    } 
    // Handle error objects with message property
    else if (error && 'message' in error) {
        return error.message;
    } 
    // Handle string errors
    else if (typeof error === 'string') {
        return error;
    } 
    // Fallback
    else {
        return 'An unexpected error occurred';
    }
}


export const getFieldError = (error: any, fieldName: string): string =>{
    let responseData: ErrorResponse | null = null;
    if (error && error.response && error.response.data) {
        responseData = error.response.data;
    }
  if (!responseData?.errors || !Array.isArray(responseData?.errors)) {
    return '';
  }
  
  const fieldError = responseData?.errors.find((error) => error.field === fieldName);
  return fieldError ? fieldError.message : '';
}

// Alternative function if you want to handle axios error directly
export const getFieldErrorFromAxios = (axiosError: any, fieldName: string): string => {
  if (!axiosError?.response?.data?.errors || !Array.isArray(axiosError.response.data.errors)) {
    return '';
  }
  
  const fieldError = axiosError.response.data.errors.find((error: ValidationError) => error.field === fieldName);
  return fieldError ? fieldError.message : '';
}