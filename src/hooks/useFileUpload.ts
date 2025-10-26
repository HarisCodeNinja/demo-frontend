import { useState } from 'react';

interface FileUploadResult {
  url: string;
  originalName: string;
}

interface UseFileUploadOptions {
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  multiple?: boolean;
}

interface UploadFileResult {
  url: string | null;
  error: string | null;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResult[]>([]);

  const {
    maxFileSize = 2, // 2MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    multiple = false,
  } = options;

  const validateFile = (file: File): string | null => {
    if (file.size / 1024 / 1024 > maxFileSize) {
      return `File size exceeds the limit. Maximum size: ${maxFileSize}MB`;
    }
    if (!allowedTypes.includes(file.type)) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }
    return null;
  };

  /**
   * Accepts a value that can be File, string (URL/path), null, or undefined.
   * If File, uploads and returns URL. If string, returns as is. If null/undefined/empty, returns null.
   * @param value File | string | null | undefined
   * @param uploadFunction The upload function
   * @returns { url, error }
   */
  const uploadFile = async <T extends { data: { url: string } }>(
    value: File | string | null | undefined,
    uploadFunction: (formData: FormData) => Promise<T>
  ): Promise<UploadFileResult> => {
    if (value === null || value === undefined || value === '') {
      return { url: null, error: null };
    }
    if (typeof value === 'string') {
      return { url: value, error: null };
    }
    if (value instanceof File) {
      const validationError = validateFile(value);
      if (validationError) {
        return { url: null, error: validationError };
      }
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('picture', value);
        const response = await uploadFunction(formData);
        const result: FileUploadResult = {
          url: response.data.url,
          originalName: value.name,
        };
        setUploadedFiles(prev => multiple ? [...prev, result] : [result]);
        return { url: response.data.url, error: null };
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
        return { url: null, error: errorMessage };
      } finally {
        setIsUploading(false);
      }
    }
    return { url: null, error: 'Invalid file input' };
  };

  const uploadMultipleFiles = async <T extends { data: { url: string } }>(
    files: (File | string | null | undefined)[],
    uploadFunction: (formData: FormData) => Promise<T>
  ): Promise<{ urls: string[]; errors: string[] }> => {
    const uploadedUrls: string[] = [];
    const errors: string[] = [];
    for (const file of files) {
      const { url, error } = await uploadFile(file, uploadFunction);
      if (url) {
        uploadedUrls.push(url);
      }
      if (error) {
        errors.push(error);
      }
    }
    return { urls: uploadedUrls, errors };
  };

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    uploadedFiles,
    clearUploadedFiles,
    removeUploadedFile,
  };
}; 