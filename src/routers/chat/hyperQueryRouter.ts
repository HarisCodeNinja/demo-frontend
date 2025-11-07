import { hyperApi, HyperResponse } from './hyperApi';

/**
 * HYPER Query Router
 * Maps natural language queries to appropriate HYPER API endpoints
 */

export interface QueryMatch {
  matched: boolean;
  endpoint: () => Promise<HyperResponse>;
  params?: any;
  category: 'employee' | 'recruitment' | 'attendance' | 'dashboard' | 'none';
}

/**
 * Query pattern definitions with multiple variations
 */
const QUERY_PATTERNS = {
  // Employee Lifecycle Patterns
  missingDocuments: [
    /missing documents?/i,
    /incomplete documents?/i,
    /documents? (not|missing)/i,
    /employees? (with|having) missing/i,
  ],
  incompleteOnboarding: [
    /(incomplete|pending|not completed?) onboarding/i,
    /onboarding (incomplete|pending|not (completed?|finished?))/i,
    /(who|which).*(hasn't|haven't|not) completed onboarding/i,
  ],
  roleMismatches: [
    /role mismatch(es)?/i,
    /mismatch.*(role|hrm|payroll)/i,
    /(hrm|payroll).*(mismatch|different|inconsistent)/i,
    /flag.*(mismatch)/i,
  ],
  newHires: [
    /new (hire|employee|joiner)s?/i,
    /(who|which).*(joined|started) (this|last)/i,
    /recent (hire|employee|joiner)s?/i,
  ],

  // Recruitment Patterns
  pendingFeedback: [
    /pending (feedback|interview)/i,
    /waiting (for )?(feedback|interview)/i,
    /(candidate|interview)s? (waiting|pending)/i,
    /feedback (pending|not (received|submitted))/i,
  ],
  candidateMatching: [
    /best (match|candidate)s?/i,
    /(match|suitable|qualified) (candidate|applicant)s?/i,
    /who('s| is) (best )?match(ed)?/i,
  ],
  hiringFunnel: [
    /hiring funnel/i,
    /recruitment (funnel|pipeline|stats)/i,
    /(summarize|show).*(hiring|recruitment)/i,
  ],
  pipelineSummary: [
    /(recruitment|hiring) pipeline/i,
    /pipeline (summary|status)/i,
    /open (position|job)s?.*(status|pipeline)/i,
  ],

  // Attendance Patterns
  todayAttendance: [
    /today'?s? (attendance|summary)/i,
    /attendance (today|summary)/i,
    /who('s| is) (present|absent) today/i,
  ],
  absenteePatterns: [
    /absen(t|ce) (pattern|frequent)/i,
    /(who|which).*(absent|absence).*(time|day|week|month)/i,
    /frequent(ly)? absent/i,
  ],
  lateComers: [
    /late (comer|employee|arrival)s?/i,
    /(who|which).*(late|tardy)/i,
    /show.*(late|lateness)/i,
  ],
  attendanceAnomalies: [
    /(attendance )?anomal(y|ies)/i,
    /detect.*(anomal|issue|problem)/i,
    /unusual.*(attendance|pattern)/i,
  ],

  // Dashboard Patterns
  headcount: [
    /headcount/i,
    /employee count/i,
    /how many employee/i,
    /department.*wise.*count/i,
    /total employees?/i,
  ],
  openPositions: [
    /open position/i,
    /job opening/i,
    /vacant (position|role)/i,
    /active recruitment/i,
  ],
  leaveOverview: [
    /leave (overview|summary|status)/i,
    /(pending|approved) leave/i,
    /leave application/i,
  ],
  quickStats: [
    /dashboard/i,
    /quick stats?/i,
    /show (me )?(everything|all|overview)/i,
    /overall (stats|summary|status)/i,
  ],
};

/**
 * Helper to calculate date ranges
 */
function getDateRange(period: 'week' | 'month' | 'today') {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case 'today':
      return {
        startDate: today.toISOString(),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      };
    case 'week':
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return {
        startDate: weekAgo.toISOString(),
        endDate: now.toISOString(),
      };
    case 'month':
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return {
        startDate: monthAgo.toISOString(),
        endDate: now.toISOString(),
      };
  }
}

/**
 * Extract time period from query
 */
function extractTimePeriod(query: string): 'week' | 'month' | 'today' | null {
  if (/today|this day/i.test(query)) return 'today';
  if (/(this|last|past) week/i.test(query)) return 'week';
  if (/(this|last|past) month/i.test(query)) return 'month';
  return null;
}

/**
 * Extract number threshold from query
 */
function extractThreshold(query: string): number | null {
  const match = query.match(/more than (\d+)|over (\d+)|(\d+)\+|(\d+) times/i);
  if (match) {
    return parseInt(match[1] || match[2] || match[3] || match[4]);
  }
  return null;
}

/**
 * Main query router function
 * Analyzes user query and routes to appropriate HYPER API
 */
export async function routeHyperQuery(query: string): Promise<QueryMatch> {
  const lowerQuery = query.toLowerCase();

  // ============================================================================
  // Employee Lifecycle Routes
  // ============================================================================

  // Missing Documents
  if (QUERY_PATTERNS.missingDocuments.some((pattern) => pattern.test(query))) {
    return {
      matched: true,
      category: 'employee',
      endpoint: () => hyperApi.employeeLifecycle.getMissingDocuments(),
    };
  }

  // Incomplete Onboarding
  if (QUERY_PATTERNS.incompleteOnboarding.some((pattern) => pattern.test(query))) {
    return {
      matched: true,
      category: 'employee',
      endpoint: () => hyperApi.employeeLifecycle.getIncompleteOnboarding(),
    };
  }

  // Role Mismatches
  if (QUERY_PATTERNS.roleMismatches.some((pattern) => pattern.test(query))) {
    return {
      matched: true,
      category: 'employee',
      endpoint: () => hyperApi.employeeLifecycle.getRoleMismatches(),
    };
  }

  // New Hires
  if (QUERY_PATTERNS.newHires.some((pattern) => pattern.test(query))) {
    const period = extractTimePeriod(query);
    const params = period ? getDateRange(period) : {};
    return {
      matched: true,
      category: 'employee',
      endpoint: () => hyperApi.employeeLifecycle.getNewHiresSummary(params),
      params,
    };
  }

  // ============================================================================
  // Recruitment Routes
  // ============================================================================

  // Pending Feedback
  if (QUERY_PATTERNS.pendingFeedback.some((pattern) => pattern.test(query))) {
    return {
      matched: true,
      category: 'recruitment',
      endpoint: () => hyperApi.recruitment.getPendingFeedback(),
    };
  }

  // Hiring Funnel
  if (QUERY_PATTERNS.hiringFunnel.some((pattern) => pattern.test(query))) {
    const period = extractTimePeriod(query);
    const params = period ? getDateRange(period) : {};
    return {
      matched: true,
      category: 'recruitment',
      endpoint: () => hyperApi.recruitment.getHiringFunnel(params),
      params,
    };
  }

  // Pipeline Summary
  if (QUERY_PATTERNS.pipelineSummary.some((pattern) => pattern.test(query))) {
    return {
      matched: true,
      category: 'recruitment',
      endpoint: () => hyperApi.recruitment.getPipelineSummary(),
    };
  }

  // ============================================================================
  // Attendance Routes
  // ============================================================================

  // Today's Attendance
  if (QUERY_PATTERNS.todayAttendance.some((pattern) => pattern.test(query))) {
    return {
      matched: true,
      category: 'attendance',
      endpoint: () => hyperApi.attendance.getTodaySummary(),
    };
  }

  // Absentee Patterns
  if (QUERY_PATTERNS.absenteePatterns.some((pattern) => pattern.test(query))) {
    const period = extractTimePeriod(query) || 'week';
    const threshold = extractThreshold(query);
    const params = {
      ...getDateRange(period),
      ...(threshold && { minAbsences: threshold }),
    };
    return {
      matched: true,
      category: 'attendance',
      endpoint: () => hyperApi.attendance.getAbsenteePatterns(params),
      params,
    };
  }

  // Late Comers
  if (QUERY_PATTERNS.lateComers.some((pattern) => pattern.test(query))) {
    return {
      matched: true,
      category: 'attendance',
      endpoint: () => hyperApi.attendance.getLateComers(),
    };
  }

  // Attendance Anomalies
  if (QUERY_PATTERNS.attendanceAnomalies.some((pattern) => pattern.test(query))) {
    const period = extractTimePeriod(query) || 'month';
    const params = getDateRange(period);
    return {
      matched: true,
      category: 'attendance',
      endpoint: () => hyperApi.attendance.getAnomalyDetection(params),
      params,
    };
  }

  // ============================================================================
  // Dashboard Routes
  // ============================================================================

  // Headcount Distribution
  if (QUERY_PATTERNS.headcount.some((pattern) => pattern.test(query))) {
    console.log('[HYPER Router] Matched: Headcount Distribution');
    return {
      matched: true,
      category: 'dashboard',
      endpoint: () => hyperApi.dashboard.getHeadcountDistribution(),
    };
  }

  // Open Positions
  if (QUERY_PATTERNS.openPositions.some((pattern) => pattern.test(query))) {
    return {
      matched: true,
      category: 'dashboard',
      endpoint: () => hyperApi.dashboard.getOpenPositions(),
    };
  }

  // Leave Overview
  if (QUERY_PATTERNS.leaveOverview.some((pattern) => pattern.test(query))) {
    return {
      matched: true,
      category: 'dashboard',
      endpoint: () => hyperApi.dashboard.getLeaveOverview(),
    };
  }

  // Quick Stats (Dashboard)
  if (QUERY_PATTERNS.quickStats.some((pattern) => pattern.test(query))) {
    return {
      matched: true,
      category: 'dashboard',
      endpoint: () => hyperApi.dashboard.getQuickStats(),
    };
  }

  // No match found
  return {
    matched: false,
    category: 'none',
    endpoint: async () => ({ data: null, meta: { message: 'No matching endpoint found' } }),
  };
}

/**
 * Check if a query should use HYPER API
 */
export function shouldUseHyperApi(query: string): boolean {
  const allPatterns = Object.values(QUERY_PATTERNS).flat();
  const matches = allPatterns.some((pattern) => pattern.test(query));

  console.log('[HYPER Router] Checking patterns for query:', query);
  console.log('[HYPER Router] Pattern match found:', matches);

  // Debug: Show which pattern matched
  if (matches) {
    const matchedPattern = Object.entries(QUERY_PATTERNS).find(([key, patterns]) =>
      patterns.some(p => p.test(query))
    );
    console.log('[HYPER Router] Matched pattern group:', matchedPattern?.[0]);
  }

  return matches;
}
