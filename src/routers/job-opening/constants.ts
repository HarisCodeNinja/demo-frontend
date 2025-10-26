/**
 * JobOpening Module Constants
 *
 * Centralized constants for the jobOpening module to avoid magic strings
 * and make refactoring easier.
 */

export const JOBOPENING_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'jobOpening',
  ENTITY_NAME: 'JobOpening',
  ENTITY_NAME_PLURAL: 'JobOpenings',
  LABEL_FIELD: 'title',

  // Table configuration
  TABLE_CONFIG_KEY: 'jobOpeningTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'jobOpeningId',

  // Field names
  FIELDS: {
    JOBOPENINGID: 'jobOpeningId',
    TITLE: 'title',
    DESCRIPTION: 'description',
    DEPARTMENTID: 'departmentId',
    LOCATIONID: 'locationId',
    REQUIREDEXPERIENCE: 'requiredExperience',
    STATUS: 'status',
    PUBLISHEDAT: 'publishedAt',
    CLOSEDAT: 'closedAt',
    CREATEDBY: 'createdBy',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    DESIGNATIONID: 'designationId'
  },

  // Routes
  ROUTES: {
    LIST: '/jobOpenings',    CREATE: '/jobOpenings/create',
    EDIT: '/jobOpenings/edit',
    VIEW: '/jobOpenings/view'
  },

  // React Query keys
  QUERY_KEY: 'jobOpening',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'jobOpening',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default JOBOPENING_CONSTANTS;