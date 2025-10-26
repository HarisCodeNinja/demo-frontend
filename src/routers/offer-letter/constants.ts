/**
 * OfferLetter Module Constants
 *
 * Centralized constants for the offerLetter module to avoid magic strings
 * and make refactoring easier.
 */

export const OFFERLETTER_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'offerLetter',
  ENTITY_NAME: 'OfferLetter',
  ENTITY_NAME_PLURAL: 'OfferLetters',
  LABEL_FIELD: 'termsAndCondition',

  // Table configuration
  TABLE_CONFIG_KEY: 'offerLetterTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'offerLetterId',

  // Field names
  FIELDS: {
    OFFERLETTERID: 'offerLetterId',
    JOBOPENINGID: 'jobOpeningId',
    SALARYOFFERED: 'salaryOffered',
    JOININGDATE: 'joiningDate',
    TERMSANDCONDITION: 'termsAndCondition',
    STATUS: 'status',
    ISSUEDBY: 'issuedBy',
    APPROVEDBY: 'approvedBy',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    CANDIDATEID: 'candidateId'
  },

  // Routes
  ROUTES: {
    LIST: '/offerLetters',    CREATE: '/offerLetters/create',
    EDIT: '/offerLetters/edit',
    VIEW: '/offerLetters/view'
  },

  // React Query keys
  QUERY_KEY: 'offerLetter',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'offerLetter',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default OFFERLETTER_CONSTANTS;