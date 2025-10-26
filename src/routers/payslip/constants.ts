/**
 * Payslip Module Constants
 *
 * Centralized constants for the payslip module to avoid magic strings
 * and make refactoring easier.
 */

export const PAYSLIP_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'payslip',
  ENTITY_NAME: 'Payslip',
  ENTITY_NAME_PLURAL: 'Payslips',
  LABEL_FIELD: 'pdfUrl',

  // Table configuration
  TABLE_CONFIG_KEY: 'payslipTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'payslipId',

  // Field names
  FIELDS: {
    PAYSLIPID: 'payslipId',
    PAYPERIODSTART: 'payPeriodStart',
    PAYPERIODEND: 'payPeriodEnd',
    GROSSSALARY: 'grossSalary',
    NETSALARY: 'netSalary',
    DEDUCTIONSAMOUNT: 'deductionsAmount',
    ALLOWANCESAMOUNT: 'allowancesAmount',
    PDFURL: 'pdfUrl',
    GENERATEDBY: 'generatedBy',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    EMPLOYEEID: 'employeeId'
  },

  // Routes
  ROUTES: {
    LIST: '/payslips',    CREATE: '/payslips/create',
    EDIT: '/payslips/edit',
    VIEW: '/payslips/view'
  },

  // React Query keys
  QUERY_KEY: 'payslip',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'payslip',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default PAYSLIP_CONSTANTS;