/**
 * User Module Constants
 *
 * Centralized constants for the user module to avoid magic strings
 * and make refactoring easier.
 */

export const USER_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'user',
  ENTITY_NAME: 'User',
  ENTITY_NAME_PLURAL: 'Users',
  LABEL_FIELD: 'email',

  // Table configuration
  TABLE_CONFIG_KEY: 'userTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'userId',

  // Field names
  FIELDS: {
    USERID: 'userId',
    EMAIL: 'email',
    USERNAME: 'username',
    PASSWORD: 'password',
    ROLE: 'role',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt'
  },

  // Routes
  ROUTES: {
    LIST: '/users',    CREATE: '/users/create',
    EDIT: '/users/edit',
    VIEW: '/users/view'
  },

  // React Query keys
  QUERY_KEY: 'user',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'user',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default USER_CONSTANTS;