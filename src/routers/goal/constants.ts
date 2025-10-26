/**
 * Goal Module Constants
 *
 * Centralized constants for the goal module to avoid magic strings
 * and make refactoring easier.
 */

export const GOAL_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'goal',
  ENTITY_NAME: 'Goal',
  ENTITY_NAME_PLURAL: 'Goals',
  LABEL_FIELD: 'title',

  // Table configuration
  TABLE_CONFIG_KEY: 'goalTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'goalId',

  // Field names
  FIELDS: {
    GOALID: 'goalId',
    KPI: 'kpi',
    TITLE: 'title',
    DESCRIPTION: 'description',
    PERIOD: 'period',
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
    LIST: '/goals',    CREATE: '/goals/create',
    EDIT: '/goals/edit',
    VIEW: '/goals/view'
  },

  // React Query keys
  QUERY_KEY: 'goal',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'goal',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default GOAL_CONSTANTS;