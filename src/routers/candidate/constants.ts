/**
 * Candidate Module Constants
 *
 * Centralized constants for the candidate module to avoid magic strings
 * and make refactoring easier.
 */

export const CANDIDATE_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'candidate',
  ENTITY_NAME: 'Candidate',
  ENTITY_NAME_PLURAL: 'Candidates',
  LABEL_FIELD: 'firstName',

  // Table configuration
  TABLE_CONFIG_KEY: 'candidateTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'candidateId',

  // Field names
  FIELDS: {
    CANDIDATEID: 'candidateId',
    FIRSTNAME: 'firstName',
    LASTNAME: 'lastName',
    EMAIL: 'email',
    PHONENUMBER: 'phoneNumber',
    RESUMETEXT: 'resumeText',
    SOURCE: 'source',
    CURRENTSTATUS: 'currentStatus',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    JOBOPENINGID: 'jobOpeningId',
    REFERREDBYEMPLOYEEID: 'referredByEmployeeId'
  },

  // Routes
  ROUTES: {
    LIST: '/candidates',    CREATE: '/candidates/create',
    EDIT: '/candidates/edit',
    VIEW: '/candidates/view'
  },

  // React Query keys
  QUERY_KEY: 'candidate',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'candidate',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default CANDIDATE_CONSTANTS;