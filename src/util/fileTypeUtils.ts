export interface FileTypeInfo {
  isImage: boolean;
  isPdf: boolean;
  isExcel: boolean;
  isWord: boolean;
  isPowerpoint: boolean;
  isText: boolean;
  isArchive: boolean;
  fileType: 'image' | 'pdf' | 'excel' | 'word' | 'powerpoint' | 'text' | 'archive' | 'generic';
  icon: string;
  canPreview: boolean;
}

export const getFileTypeFromUrl = (url: string): FileTypeInfo => {
  if (!url) {
    return {
      isImage: false,
      isPdf: false,
      isExcel: false,
      isWord: false,
      isPowerpoint: false,
      isText: false,
      isArchive: false,
      fileType: 'generic',
      icon: '📄',
      canPreview: false
    };
  }

  // Extract file extension from URL
  const urlWithoutQuery = url.split('?')[0]; // Remove query parameters
  const extension = urlWithoutQuery.split('.').pop()?.toLowerCase() || '';

  // Image extensions
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'tif'];
  const isImage = imageExtensions.includes(extension);

  // PDF extensions
  const isPdf = extension === 'pdf';

  // Excel extensions
  const excelExtensions = ['xls', 'xlsx', 'xlsm', 'xlsb', 'csv'];
  const isExcel = excelExtensions.includes(extension);

  // Word extensions
  const wordExtensions = ['doc', 'docx', 'docm', 'dot', 'dotx'];
  const isWord = wordExtensions.includes(extension);

  // PowerPoint extensions
  const powerpointExtensions = ['ppt', 'pptx', 'pptm', 'pot', 'potx'];
  const isPowerpoint = powerpointExtensions.includes(extension);

  // Text extensions
  const textExtensions = ['txt', 'rtf', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx'];
  const isText = textExtensions.includes(extension);

  // Archive extensions
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
  const isArchive = archiveExtensions.includes(extension);

  let fileType: FileTypeInfo['fileType'] = 'generic';
  let icon = '📄';

  if (isImage) {
    fileType = 'image';
    icon = '🖼️';
  } else if (isPdf) {
    fileType = 'pdf';
    icon = '📕';
  } else if (isExcel) {
    fileType = 'excel';
    icon = '📊';
  } else if (isWord) {
    fileType = 'word';
    icon = '📝';
  } else if (isPowerpoint) {
    fileType = 'powerpoint';
    icon = '📽️';
  } else if (isText) {
    fileType = 'text';
    icon = '📄';
  } else if (isArchive) {
    fileType = 'archive';
    icon = '📦';
  }

  return {
    isImage,
    isPdf,
    isExcel,
    isWord,
    isPowerpoint,
    isText,
    isArchive,
    fileType,
    icon,
    canPreview: isImage // Only images can be previewed inline
  };
};

export const getFileExtension = (url: string): string => {
  if (!url) return '';
  const urlWithoutQuery = url.split('?')[0];
  return urlWithoutQuery.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (url: string): boolean => {
  return getFileTypeFromUrl(url).isImage;
};

export const openFileInNewTab = (url: string, fileName?: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  if (fileName) {
    link.download = fileName;
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
