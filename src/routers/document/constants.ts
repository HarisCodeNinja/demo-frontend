/**
 * Document Module Constants
 *
 * Centralized constants for the document module to avoid magic strings
 * and make refactoring easier.
 */

export const DOCUMENT_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'document',
  ENTITY_NAME: 'Document',
  ENTITY_NAME_PLURAL: 'Documents',
  LABEL_FIELD: 'documentType',

  // Table configuration
  TABLE_CONFIG_KEY: 'documentTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'documentId',

  // Field names
  FIELDS: {
    DOCUMENTID: 'documentId',
    DOCUMENTTYPE: 'documentType',
    FILENAME: 'fileName',
    FILEURL: 'fileUrl',
    UPLOADEDBY: 'uploadedBy',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    EMPLOYEEID: 'employeeId'
  },

  // Routes
  ROUTES: {
    LIST: '/documents',    CREATE: '/documents/create',
    EDIT: '/documents/edit',
    VIEW: '/documents/view'
  },

  // React Query keys
  QUERY_KEY: 'document',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'document',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default DOCUMENT_CONSTANTS;