/**
 * Location Module Constants
 *
 * Centralized constants for the location module to avoid magic strings
 * and make refactoring easier.
 */

export const LOCATION_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'location',
  ENTITY_NAME: 'Location',
  ENTITY_NAME_PLURAL: 'Locations',
  LABEL_FIELD: 'locationName',

  // Table configuration
  TABLE_CONFIG_KEY: 'locationTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'locationId',

  // Field names
  FIELDS: {
    LOCATIONID: 'locationId',
    LOCATIONNAME: 'locationName',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt'
  },

  // Routes
  ROUTES: {
    LIST: '/locations',    CREATE: '/locations/create',
    EDIT: '/locations/edit',
    VIEW: '/locations/view'
  },

  // React Query keys
  QUERY_KEY: 'location',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'location',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default LOCATION_CONSTANTS;