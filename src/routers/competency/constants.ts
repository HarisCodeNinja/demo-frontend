/**
 * Competency Module Constants
 *
 * Centralized constants for the competency module to avoid magic strings
 * and make refactoring easier.
 */

export const COMPETENCY_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'competency',
  ENTITY_NAME: 'Competency',
  ENTITY_NAME_PLURAL: 'Competencys',
  LABEL_FIELD: 'description',

  // Table configuration
  TABLE_CONFIG_KEY: 'competencyTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'competencyId',

  // Field names
  FIELDS: {
    COMPETENCYID: 'competencyId',
    COMPETENCYNAME: 'competencyName',
    DESCRIPTION: 'description',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt'
  },

  // Routes
  ROUTES: {
    LIST: '/competencys',    CREATE: '/competencys/create',
    EDIT: '/competencys/edit',
    VIEW: '/competencys/view'
  },

  // React Query keys
  QUERY_KEY: 'competency',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'competency',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default COMPETENCY_CONSTANTS;