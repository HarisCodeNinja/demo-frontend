/**
 * PerformanceReview Module Constants
 *
 * Centralized constants for the performanceReview module to avoid magic strings
 * and make refactoring easier.
 */

export const PERFORMANCEREVIEW_CONSTANTS = {
  // Entity identifiers
  ENTITY_KEY: 'performanceReview',
  ENTITY_NAME: 'PerformanceReview',
  ENTITY_NAME_PLURAL: 'PerformanceReviews',
  LABEL_FIELD: 'reviewPeriod',

  // Table configuration
  TABLE_CONFIG_KEY: 'performanceReviewTableConfiguration',

  // Primary key field
  PRIMARY_KEY: 'performanceReviewId',

  // Field names
  FIELDS: {
    PERFORMANCEREVIEWID: 'performanceReviewId',
    REVIEWERID: 'reviewerId',
    REVIEWPERIOD: 'reviewPeriod',
    REVIEWDATE: 'reviewDate',
    SELFASSESSMENT: 'selfAssessment',
    MANAGERFEEDBACK: 'managerFeedback',
    OVERALLRATING: 'overallRating',
    RECOMMENDATION: 'recommendation',
    STATUS: 'status',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    EMPLOYEEID: 'employeeId'
  },

  // Routes
  ROUTES: {
    LIST: '/performanceReviews',    CREATE: '/performanceReviews/create',
    EDIT: '/performanceReviews/edit',
    VIEW: '/performanceReviews/view'
  },

  // React Query keys
  QUERY_KEY: 'performanceReview',

  // Permission configuration
  PERMISSIONS: {
    MODULE: '',
    RESOURCE: 'performanceReview',
    ACTIONS: {
      VIEW: 'view' as const,
      EDIT: 'edit' as const,
      DELETE: 'delete' as const
    },
  },
} as const;

export default PERFORMANCEREVIEW_CONSTANTS;