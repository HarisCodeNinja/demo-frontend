/**
 * CandidateSkill Module Constants
 *
 * Centralized constants for the candidateSkill module to avoid magic strings
 * and make refactoring easier.
 */

export const CANDIDATESKILL_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'candidateSkill',
  ENTITY_NAME: 'CandidateSkill',
  ENTITY_NAME_PLURAL: 'CandidateSkills',
  LABEL_FIELD: 'name',

  // Table configuration
  TABLE_CONFIG_KEY: 'candidateSkillTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'candidateSkillId',

  // Field names
  FIELDS: {
    CANDIDATESKILLID: 'candidateSkillId',
    CANDIDATEID: 'candidateId',
    PROFICIENCY: 'proficiency',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    SKILLID: 'skillId'
  },

  // Routes
  ROUTES: {
    LIST: '/candidateSkills',    CREATE: '/candidateSkills/create',
    EDIT: '/candidateSkills/edit',
    VIEW: '/candidateSkills/view'
  },

  // React Query keys
  QUERY_KEY: 'candidateSkill',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'candidateSkill',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default CANDIDATESKILL_CONSTANTS;