/**
 * JobOpeningSkill Module Constants
 *
 * Centralized constants for the jobOpeningSkill module to avoid magic strings
 * and make refactoring easier.
 */

export const JOBOPENINGSKILL_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'jobOpeningSkill',
  ENTITY_NAME: 'JobOpeningSkill',
  ENTITY_NAME_PLURAL: 'JobOpeningSkills',
  LABEL_FIELD: 'name',

  // Table configuration
  TABLE_CONFIG_KEY: 'jobOpeningSkillTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'jobOpeningSkillId',

  // Field names
  FIELDS: {
    JOBOPENINGSKILLID: 'jobOpeningSkillId',
    SKILLID: 'skillId',
    REQUIREDLEVEL: 'requiredLevel',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    JOBOPENINGID: 'jobOpeningId'
  },

  // Routes
  ROUTES: {
    LIST: '/jobOpeningSkills',    CREATE: '/jobOpeningSkills/create',
    EDIT: '/jobOpeningSkills/edit',
    VIEW: '/jobOpeningSkills/view'
  },

  // React Query keys
  QUERY_KEY: 'jobOpeningSkill',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'jobOpeningSkill',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default JOBOPENINGSKILL_CONSTANTS;