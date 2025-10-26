/**
 * RoleCompetency Module Constants
 *
 * Centralized constants for the roleCompetency module to avoid magic strings
 * and make refactoring easier.
 */

export const ROLECOMPETENCY_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'roleCompetency',
  ENTITY_NAME: 'RoleCompetency',
  ENTITY_NAME_PLURAL: 'RoleCompetencys',
  LABEL_FIELD: 'name',

  // Table configuration
  TABLE_CONFIG_KEY: 'roleCompetencyTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'roleCompetencyId',

  // Field names
  FIELDS: {
    ROLECOMPETENCYID: 'roleCompetencyId',
    REQUIREDPROFICIENCY: 'requiredProficiency',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    DESIGNATIONID: 'designationId',
    COMPETENCYID: 'competencyId'
  },

  // Routes
  ROUTES: {
    LIST: '/roleCompetencys',    CREATE: '/roleCompetencys/create',
    EDIT: '/roleCompetencys/edit',
    VIEW: '/roleCompetencys/view'
  },

  // React Query keys
  QUERY_KEY: 'roleCompetency',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'roleCompetency',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default ROLECOMPETENCY_CONSTANTS;