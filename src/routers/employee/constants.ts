/**
 * Employee Module Constants
 *
 * Centralized constants for the employee module to avoid magic strings
 * and make refactoring easier.
 */

export const EMPLOYEE_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'employee',
  ENTITY_NAME: 'Employee',
  ENTITY_NAME_PLURAL: 'Employees',
  LABEL_FIELD: 'firstName',

  // Table configuration
  TABLE_CONFIG_KEY: 'employeeTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'employeeId',

  // Field names
  FIELDS: {
    EMPLOYEEID: 'employeeId',
    EMPLOYEEUNIQUEID: 'employeeUniqueId',
    FIRSTNAME: 'firstName',
    LASTNAME: 'lastName',
    DATEOFBIRTH: 'dateOfBirth',
    GENDER: 'gender',
    PHONENUMBER: 'phoneNumber',
    ADDRESS: 'address',
    PERSONALEMAIL: 'personalEmail',
    EMPLOYMENTSTARTDATE: 'employmentStartDate',
    EMPLOYMENTENDDATE: 'employmentEndDate',
    DESIGNATIONID: 'designationId',
    STATUS: 'status',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    USERID: 'userId',
    DEPARTMENTID: 'departmentId',
    REPORTINGMANAGERID: 'reportingManagerId'
  },

  // Routes
  ROUTES: {
    LIST: '/employees',    CREATE: '/employees/create',
    EDIT: '/employees/edit',
    VIEW: '/employees/view'
  },

  // React Query keys
  QUERY_KEY: 'employee',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'employee',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default EMPLOYEE_CONSTANTS;