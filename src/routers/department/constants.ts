/**
 * Department Module Constants
 *
 * Centralized constants for the department module to avoid magic strings
 * and make refactoring easier.
 */

export const DEPARTMENT_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'department',
  ENTITY_NAME: 'Department',
  ENTITY_NAME_PLURAL: 'Departments',
  LABEL_FIELD: 'departmentName',

  // Table configuration
  TABLE_CONFIG_KEY: 'departmentTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'departmentId',

  // Field names
  FIELDS: {
    DEPARTMENTID: 'departmentId',
    DEPARTMENTNAME: 'departmentName',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt'
  },

  // Routes
  ROUTES: {
    LIST: '/departments',    CREATE: '/departments/create',
    EDIT: '/departments/edit',
    VIEW: '/departments/view'
  },

  // React Query keys
  QUERY_KEY: 'department',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'department',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default DEPARTMENT_CONSTANTS;