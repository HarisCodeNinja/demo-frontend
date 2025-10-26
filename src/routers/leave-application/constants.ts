/**
 * LeaveApplication Module Constants
 *
 * Centralized constants for the leaveApplication module to avoid magic strings
 * and make refactoring easier.
 */

export const LEAVEAPPLICATION_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'leaveApplication',
  ENTITY_NAME: 'LeaveApplication',
  ENTITY_NAME_PLURAL: 'LeaveApplications',
  LABEL_FIELD: 'reason',

  // Table configuration
  TABLE_CONFIG_KEY: 'leaveApplicationTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'leaveApplicationId',

  // Field names
  FIELDS: {
    LEAVEAPPLICATIONID: 'leaveApplicationId',
    ENDDATE: 'endDate',
    LEAVETYPEID: 'leaveTypeId',
    STARTDATE: 'startDate',
    NUMBEROFDAY: 'numberOfDay',
    REASON: 'reason',
    STATUS: 'status',
    APPLIEDBY: 'appliedBy',
    APPROVEDBY: 'approvedBy',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    EMPLOYEEID: 'employeeId'
  },

  // Routes
  ROUTES: {
    LIST: '/leaveApplications',    CREATE: '/leaveApplications/create',
    EDIT: '/leaveApplications/edit',
    VIEW: '/leaveApplications/view'
  },

  // React Query keys
  QUERY_KEY: 'leaveApplication',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'leaveApplication',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default LEAVEAPPLICATION_CONSTANTS;