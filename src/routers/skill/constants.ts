/**
 * Skill Module Constants
 *
 * Centralized constants for the skill module to avoid magic strings
 * and make refactoring easier.
 */

export const SKILL_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'skill',
  ENTITY_NAME: 'Skill',
  ENTITY_NAME_PLURAL: 'Skills',
  LABEL_FIELD: 'skillName',

  // Table configuration
  TABLE_CONFIG_KEY: 'skillTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'skillId',

  // Field names
  FIELDS: {
    SKILLID: 'skillId',
    SKILLNAME: 'skillName',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt'
  },

  // Routes
  ROUTES: {
    LIST: '/skills',    CREATE: '/skills/create',
    EDIT: '/skills/edit',
    VIEW: '/skills/view'
  },

  // React Query keys
  QUERY_KEY: 'skill',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'skill',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default SKILL_CONSTANTS;