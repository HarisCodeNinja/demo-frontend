/**
 * EmployeeCompetency Module Constants
 *
 * Centralized constants for the employeeCompetency module to avoid magic strings
 * and make refactoring easier.
 */

export const EMPLOYEECOMPETENCY_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'employeeCompetency',
  ENTITY_NAME: 'EmployeeCompetency',
  ENTITY_NAME_PLURAL: 'EmployeeCompetencys',
  LABEL_FIELD: 'name',

  // Table configuration
  TABLE_CONFIG_KEY: 'employeeCompetencyTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'employeeCompetencyId',

  // Field names
  FIELDS: {
    EMPLOYEECOMPETENCYID: 'employeeCompetencyId',
    EMPLOYEEID: 'employeeId',
    COMPETENCYID: 'competencyId',
    CURRENTPROFICIENCY: 'currentProficiency',
    LASTEVALUATED: 'lastEvaluated',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt'
  },

  // Routes
  ROUTES: {
    LIST: '/employeeCompetencys',    CREATE: '/employeeCompetencys/create',
    EDIT: '/employeeCompetencys/edit',
    VIEW: '/employeeCompetencys/view'
  },

  // React Query keys
  QUERY_KEY: 'employeeCompetency',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'employeeCompetency',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default EMPLOYEECOMPETENCY_CONSTANTS;