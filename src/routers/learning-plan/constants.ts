/**
 * LearningPlan Module Constants
 *
 * Centralized constants for the learningPlan module to avoid magic strings
 * and make refactoring easier.
 */

export const LEARNINGPLAN_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'learningPlan',
  ENTITY_NAME: 'LearningPlan',
  ENTITY_NAME_PLURAL: 'LearningPlans',
  LABEL_FIELD: 'title',

  // Table configuration
  TABLE_CONFIG_KEY: 'learningPlanTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'learningPlanId',

  // Field names
  FIELDS: {
    LEARNINGPLANID: 'learningPlanId',
    TITLE: 'title',
    DESCRIPTION: 'description',
    STARTDATE: 'startDate',
    ENDDATE: 'endDate',
    STATUS: 'status',
    ASSIGNEDBY: 'assignedBy',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    EMPLOYEEID: 'employeeId'
  },

  // Routes
  ROUTES: {
    LIST: '/learningPlans',    CREATE: '/learningPlans/create',
    EDIT: '/learningPlans/edit',
    VIEW: '/learningPlans/view'
  },

  // React Query keys
  QUERY_KEY: 'learningPlan',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'learningPlan',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default LEARNINGPLAN_CONSTANTS;