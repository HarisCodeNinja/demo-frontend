/**
 * JobLevel Module Constants
 *
 * Centralized constants for the jobLevel module to avoid magic strings
 * and make refactoring easier.
 */

export const JOBLEVEL_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'jobLevel',
  ENTITY_NAME: 'JobLevel',
  ENTITY_NAME_PLURAL: 'JobLevels',
  LABEL_FIELD: 'description',

  // Table configuration
  TABLE_CONFIG_KEY: 'jobLevelTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'jobLevelId',

  // Field names
  FIELDS: {
    JOBLEVELID: 'jobLevelId',
    LEVELNAME: 'levelName',
    DESCRIPTION: 'description',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt'
  },

  // Routes
  ROUTES: {
    LIST: '/jobLevels',    CREATE: '/jobLevels/create',
    EDIT: '/jobLevels/edit',
    VIEW: '/jobLevels/view'
  },

  // React Query keys
  QUERY_KEY: 'jobLevel',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'jobLevel',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default JOBLEVEL_CONSTANTS;