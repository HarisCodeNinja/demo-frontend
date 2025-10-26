interface ValidateImageParams {
  file: File;
  isSquare: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
	returnKey?: boolean;
}

const errorMessages = {
  validationError: "Validation Error",
  fileSizeError: "The file is too large. Maximum allowed size is {{maxSize}} MB.",
  notValidExtension: "Invalid file format. Allowed formats: {{validExtensions}}.",
  notAValidImage: "The file is not a valid image.",
  imageSquare: "The image is not square.",
  minWidth: "The image width is less than the minimum allowed width ({{minWidth}}px).",
  maxWidth: "The image width is greater than the maximum allowed width ({{maxWidth}}px).",
  minHeight: "The image height is less than the minimum allowed height ({{minHeight}}px).",
  maxHeight: "The image height is greater than the maximum allowed height ({{maxHeight}}px).",
  errorLoadingImage: "Error loading image.",
  errorReadingFile: "Error reading file."
};

export const isValidImage = (file: File): boolean => {
  // Common image MIME types start with 'image/'
  return file.type.startsWith('image/');
};
export const isValidFileExtension = (file: File, validExtensions: string): boolean => {
	if(validExtensions.trim() === "*.*"){
		return true;
	}
  // Extract the extension from the file name
  const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();

	// validExtensions could be "*.jpeg, *.jpg,*.png" split from comma "." and  

  // Convert the validExtensions string into an array of extensions
  const extensionsArray = validExtensions.split(',').map(ext => ext.trim().replace("*", "").replace(".", "").toLowerCase());

// 	console.log(fileExtension, extensionsArray, extensionsArray.includes(fileExtension))
  // Check if the file's extension is in the array of valid extensions
  return extensionsArray.includes(fileExtension);
};

export const isImageSquare = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Create an image element
    const img = new Image();

    // Create a FileReader to read the file
    const reader = new FileReader();

    // Set up the onload event for the FileReader
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && event.target.result) {
        // Set the source of the image element
        img.src = event.target.result as string;

        // Set up the onload event for the image element
        img.onload = () => {
          // Check if width and height are equal
          resolve(img.width === img.height);
        };

        // Set up the onerror event for the image element
        img.onerror = () => {
          reject(new Error("Error loading image"));
        };
      }
    };

    // Set up the onerror event for the FileReader
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
};


export const validateImageOld = ({ file, isSquare = false, minWidth, maxWidth, minHeight, maxHeight}: ValidateImageParams): Promise<boolean> => {
  return new Promise((resolve, reject) => {

		if(!isValidImage(file)){
			reject(new Error ("notAValidImage"))
		}
    const img = new Image();

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && event.target.result) {
        img.src = event.target.result as string;

        img.onload = () => {
          const width = img.width;
          const height = img.height;

          if (isSquare && width !== height) {
            reject(new Error("imageSquare"));
            return;
          }

          if (minWidth !== undefined && width < minWidth) {
            reject(new Error('minWidth'));
            return;
          }

          if (maxWidth !== undefined && width > maxWidth) {
            reject(new Error('maxWidth'));
            return;
          }

          if (minHeight !== undefined && height < minHeight) {
            reject(new Error('minHeight'));
            return ;
          }

          if (maxHeight !== undefined && height > maxHeight) {
            reject(new Error('maxHeight'));
            return;
          }

          resolve(true);
        };

        img.onerror = () => {
          reject(new Error("errorLoadingImage."));
        };
      }
    };

    reader.onerror = () => {
      reject(new Error("errorReadingFile"));
    };

    reader.readAsDataURL(file);
  });
};


export const validateImage = ({ file, isSquare = false, minWidth, maxWidth, minHeight, maxHeight, returnKey = false }: ValidateImageParams): Promise<boolean> => {
  return new Promise((resolve, reject) => {

    const rejectWithError = (key: keyof typeof errorMessages, params?: Record<string, string | number>) => {
      const message = errorMessages[key];
      const formattedMessage = params ? Object.keys(params).reduce((msg, param) => msg.replace(`{{${param}}}`, String(params[param])), message) : message;
      if (returnKey) {
        reject(new Error(key));
      } else {
        reject(new Error(formattedMessage));
      }
    };

    if (!isValidImage(file)) {
      rejectWithError("notAValidImage");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && event.target.result) {
        img.src = event.target.result as string;

        img.onload = () => {
          const width = img.width;
          const height = img.height;

          if (isSquare && width !== height) {
            rejectWithError("imageSquare");
            return;
          }

          if (minWidth !== undefined && width < minWidth) {
            rejectWithError("minWidth", { minWidth });
            return;
          }

          if (maxWidth !== undefined && width > maxWidth) {
            rejectWithError("maxWidth", { maxWidth });
            return;
          }

          if (minHeight !== undefined && height < minHeight) {
            rejectWithError("minHeight", { minHeight });
            return;
          }

          if (maxHeight !== undefined && height > maxHeight) {
            rejectWithError("maxHeight", { maxHeight });
            return;
          }

          resolve(true);
        };

        img.onerror = () => {
          rejectWithError("errorLoadingImage");
        };
      }
    };

    reader.onerror = () => {
      rejectWithError("errorReadingFile");
    };

    reader.readAsDataURL(file);
  });
};