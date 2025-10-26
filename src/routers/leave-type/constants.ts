/**
 * LeaveType Module Constants
 *
 * Centralized constants for the leaveType module to avoid magic strings
 * and make refactoring easier.
 */

export const LEAVETYPE_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'leaveType',
  ENTITY_NAME: 'LeaveType',
  ENTITY_NAME_PLURAL: 'LeaveTypes',
  LABEL_FIELD: 'typeName',

  // Table configuration
  TABLE_CONFIG_KEY: 'leaveTypeTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'leaveTypeId',

  // Field names
  FIELDS: {
    LEAVETYPEID: 'leaveTypeId',
    TYPENAME: 'typeName',
    MAXDAYSPERYEAR: 'maxDaysPerYear',
    ISPAID: 'isPaid',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt'
  },

  // Routes
  ROUTES: {
    LIST: '/leaveTypes',    CREATE: '/leaveTypes/create',
    EDIT: '/leaveTypes/edit',
    VIEW: '/leaveTypes/view'
  },

  // React Query keys
  QUERY_KEY: 'leaveType',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'leaveType',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default LEAVETYPE_CONSTANTS;