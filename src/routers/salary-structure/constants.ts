/**
 * SalaryStructure Module Constants
 *
 * Centralized constants for the salaryStructure module to avoid magic strings
 * and make refactoring easier.
 */

export const SALARYSTRUCTURE_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'salaryStructure',
  ENTITY_NAME: 'SalaryStructure',
  ENTITY_NAME_PLURAL: 'SalaryStructures',
  LABEL_FIELD: 'name',

  // Table configuration
  TABLE_CONFIG_KEY: 'salaryStructureTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'salaryStructureId',

  // Field names
  FIELDS: {
    SALARYSTRUCTUREID: 'salaryStructureId',
    BASICSALARY: 'basicSalary',
    ALLOWANCE: 'allowance',
    DEDUCTION: 'deduction',
    EFFECTIVEDATE: 'effectiveDate',
    STATUS: 'status',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    EMPLOYEEID: 'employeeId'
  },

  // Routes
  ROUTES: {
    LIST: '/salaryStructures',    CREATE: '/salaryStructures/create',
    EDIT: '/salaryStructures/edit',
    VIEW: '/salaryStructures/view'
  },

  // React Query keys
  QUERY_KEY: 'salaryStructure',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'salaryStructure',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default SALARYSTRUCTURE_CONSTANTS;