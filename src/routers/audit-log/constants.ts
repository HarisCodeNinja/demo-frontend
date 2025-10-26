/**
 * AuditLog Module Constants
 *
 * Centralized constants for the auditLog module to avoid magic strings
 * and make refactoring easier.
 */

export const AUDITLOG_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'auditLog',
  ENTITY_NAME: 'AuditLog',
  ENTITY_NAME_PLURAL: 'AuditLogs',
  LABEL_FIELD: 'action',

  // Table configuration
  TABLE_CONFIG_KEY: 'auditLogTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'auditLogId',

  // Field names
  FIELDS: {
    AUDITLOGID: 'auditLogId',
    ACTION: 'action',
    TABLENAME: 'tableName',
    RECORDID: 'recordId',
    OLDVALUE: 'oldValue',
    NEWVALUE: 'newValue',
    IPADDRESS: 'ipAddress',
    TIMESTAMP: 'timestamp',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    USERID: 'userId'
  },

  // Routes
  ROUTES: {
    LIST: '/auditLogs',    CREATE: '/auditLogs/create',
    EDIT: '/auditLogs/edit',
    VIEW: '/auditLogs/view'
  },

  // React Query keys
  QUERY_KEY: 'auditLog',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'auditLog',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default AUDITLOG_CONSTANTS;