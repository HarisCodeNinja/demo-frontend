/**
 * Attendance Module Constants
 *
 * Centralized constants for the attendance module to avoid magic strings
 * and make refactoring easier.
 */

export const ATTENDANCE_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'attendance',
  ENTITY_NAME: 'Attendance',
  ENTITY_NAME_PLURAL: 'Attendances',
  LABEL_FIELD: 'name',

  // Table configuration
  TABLE_CONFIG_KEY: 'attendanceTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'attendanceId',

  // Field names
  FIELDS: {
    ATTENDANCEID: 'attendanceId',
    ATTENDANCEDATE: 'attendanceDate',
    CHECKINTIME: 'checkInTime',
    CHECKOUTTIME: 'checkOutTime',
    STATUS: 'status',
    TOTALHOUR: 'totalHour',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    EMPLOYEEID: 'employeeId'
  },

  // Routes
  ROUTES: {
    LIST: '/attendances',    CREATE: '/attendances/create',
    EDIT: '/attendances/edit',
    VIEW: '/attendances/view'
  },

  // React Query keys
  QUERY_KEY: 'attendance',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'attendance',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default ATTENDANCE_CONSTANTS;