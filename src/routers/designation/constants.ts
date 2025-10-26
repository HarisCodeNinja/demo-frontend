/**
 * Designation Module Constants
 *
 * Centralized constants for the designation module to avoid magic strings
 * and make refactoring easier.
 */

export const DESIGNATION_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'designation',
  ENTITY_NAME: 'Designation',
  ENTITY_NAME_PLURAL: 'Designations',
  LABEL_FIELD: 'designationName',

  // Table configuration
  TABLE_CONFIG_KEY: 'designationTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'designationId',

  // Field names
  FIELDS: {
    DESIGNATIONID: 'designationId',
    DESIGNATIONNAME: 'designationName',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt'
  },

  // Routes
  ROUTES: {
    LIST: '/designations',    CREATE: '/designations/create',
    EDIT: '/designations/edit',
    VIEW: '/designations/view'
  },

  // React Query keys
  QUERY_KEY: 'designation',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'designation',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default DESIGNATION_CONSTANTS;