import apiClient from '@/services/apiClient';

/**
 * HYPER API Client for MCP-like intelligent endpoints
 * Handles all HYPER layer API calls with authentication
 */

export interface HyperResponse<T = any> {
  data: T;
  meta: {
    total?: number;
    message: string;
    summary?: any;
  };
}

// ============================================================================
// 1. Employee Lifecycle Monitor APIs
// ============================================================================

export const employeeLifecycleApi = {
  /**
   * Get employees with missing documents
   * Query: "Show me all employees with missing documents"
   */
  getMissingDocuments: async (params?: { departmentId?: string; days?: number; limit?: number; offset?: number }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/employee-lifecycle/missing-documents', { params });
    return response.data;
  },

  /**
   * Get employees with incomplete onboarding
   * Query: "Who hasn't completed onboarding yet?"
   */
  getIncompleteOnboarding: async (params?: { days?: number; limit?: number; offset?: number }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/employee-lifecycle/incomplete-onboarding', { params });
    return response.data;
  },

  /**
   * Get department changes
   * Query: "Show recent department changes"
   */
  getDepartmentChanges: async (params?: { startDate?: string; endDate?: string; departmentId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/employee-lifecycle/department-changes', { params });
    return response.data;
  },

  /**
   * Get role mismatches between HRM and Payroll
   * Query: "Flag any mismatched role between HRM and Payroll"
   */
  getRoleMismatches: async (): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/employee-lifecycle/role-mismatches');
    return response.data;
  },

  /**
   * Get pending verifications
   * Query: "Show pending verifications"
   */
  getPendingVerifications: async (params?: { verificationType?: string; limit?: number }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/employee-lifecycle/pending-verifications', { params });
    return response.data;
  },

  /**
   * Get new hires summary
   * Query: "Show me new hires this month"
   */
  getNewHiresSummary: async (params?: { startDate?: string; endDate?: string; departmentId?: string; onboardingStatus?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/employee-lifecycle/new-hires-summary', { params });
    return response.data;
  },

  /**
   * Get offboarding checklist
   * Query: "Show offboarding checklist for employee"
   */
  getOffboardingChecklist: async (params?: { employeeId?: string; status?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/employee-lifecycle/offboarding-checklist', { params });
    return response.data;
  },
};

// ============================================================================
// 2. Recruitment Intelligence APIs
// ============================================================================

export const recruitmentApi = {
  /**
   * Get interviews pending feedback
   * Query: "Show all candidates waiting for interview feedback"
   */
  getPendingFeedback: async (params?: { jobOpeningId?: string; daysPending?: number; limit?: number }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/recruitment/pending-feedback', { params });
    return response.data;
  },

  /**
   * Get candidates matching a job opening
   * Query: "Who's best matched for the Frontend Developer role?"
   */
  getCandidateMatching: async (
    jobOpeningId: string,
    params?: {
      minMatchScore?: number;
      limit?: number;
      offset?: number;
    },
  ): Promise<HyperResponse> => {
    const response = await apiClient.get(`/hyper/recruitment/candidate-matching/${jobOpeningId}`, { params });
    return response.data;
  },

  /**
   * Get hiring funnel metrics
   * Query: "Summarize this week's hiring funnel"
   */
  getHiringFunnel: async (params?: { startDate?: string; endDate?: string; jobOpeningId?: string; departmentId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/recruitment/hiring-funnel', { params });
    return response.data;
  },

  /**
   * Get recruitment pipeline summary
   * Query: "Show recruitment pipeline"
   */
  getPipelineSummary: async (params?: { departmentId?: string; status?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/recruitment/pipeline-summary', { params });
    return response.data;
  },

  /**
   * Get overdue interviews
   * Query: "Show overdue interviews"
   */
  getOverdueInterviews: async (params?: { daysPastDue?: number; limit?: number }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/recruitment/overdue-interviews', { params });
    return response.data;
  },

  /**
   * Get recruiter performance metrics
   * Query: "Show recruiter performance"
   */
  getRecruiterPerformance: async (params?: { startDate?: string; endDate?: string; recruiterId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/recruitment/recruiter-performance', { params });
    return response.data;
  },
};

// ============================================================================
// 3. Attendance Insights APIs
// ============================================================================

export const attendanceApi = {
  /**
   * Get today's attendance summary
   * Query: "Give me today's attendance summary"
   */
  getTodaySummary: async (params?: { date?: string; departmentId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/attendance/today-summary', { params });
    return response.data;
  },

  /**
   * Get absentee patterns
   * Query: "Who's been absent more than 3 times this week?"
   */
  getAbsenteePatterns: async (params?: { startDate?: string; endDate?: string; minAbsences?: number; departmentId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/attendance/absentee-patterns', { params });
    return response.data;
  },

  /**
   * Get late comers
   * Query: "Show today's late comers"
   */
  getLateComers: async (params?: { date?: string; minLateMinutes?: number; departmentId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/attendance/late-comers', { params });
    return response.data;
  },

  /**
   * Detect attendance anomalies
   * Query: "Detect any attendance anomalies this month"
   */
  getAnomalyDetection: async (params?: { startDate?: string; endDate?: string; severity?: string; departmentId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/attendance/anomaly-detection', { params });
    return response.data;
  },

  /**
   * Get team attendance for a manager
   * Query: "Show my team's attendance"
   */
  getTeamAttendance: async (
    managerId: string,
    params?: {
      date?: string;
    },
  ): Promise<HyperResponse> => {
    const response = await apiClient.get(`/hyper/attendance/team-attendance/${managerId}`, { params });
    return response.data;
  },

  /**
   * Get monthly attendance trends
   * Query: "Show attendance trends this month"
   */
  getMonthlyTrends: async (params?: { year?: number; month?: number; departmentId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/attendance/monthly-trends', { params });
    return response.data;
  },
};

// ============================================================================
// 4. Conversational Dashboard APIs
// ============================================================================

export const dashboardApi = {
  /**
   * Get headcount distribution
   * Query: "Give me department-wise headcount"
   */
  getHeadcountDistribution: async (): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/dashboard/headcount-distribution');
    return response.data;
  },

  /**
   * Get open positions
   * Query: "List open positions and assigned recruiters"
   */
  getOpenPositions: async (params?: { departmentId?: string; status?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/dashboard/open-positions', { params });
    return response.data;
  },

  /**
   * Get recent hires
   * Query: "Who joined this week?"
   */
  getRecentHires: async (params?: { startDate?: string; endDate?: string; departmentId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/dashboard/recent-hires', { params });
    return response.data;
  },

  /**
   * Get department summary
   * Query: "Show me Engineering department summary"
   */
  getDepartmentSummary: async (departmentId: string): Promise<HyperResponse> => {
    const response = await apiClient.get(`/hyper/dashboard/department-summary/${departmentId}`);
    return response.data;
  },

  /**
   * Get leave overview
   * Query: "Show leave overview"
   */
  getLeaveOverview: async (params?: { startDate?: string; endDate?: string; status?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/dashboard/leave-overview', { params });
    return response.data;
  },

  /**
   * Get payroll summary
   * Query: "Show payroll summary"
   */
  getPayrollSummary: async (params?: { month?: number; year?: number }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/dashboard/payroll-summary', { params });
    return response.data;
  },

  /**
   * Get performance snapshot
   * Query: "Show performance snapshot"
   */
  getPerformanceSnapshot: async (params?: { departmentId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/dashboard/performance-snapshot', { params });
    return response.data;
  },

  /**
   * Get goals statistics
   * Query: "Show goals stats"
   */
  getGoalsStats: async (params?: { status?: string; departmentId?: string }): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/dashboard/goals-stats', { params });
    return response.data;
  },

  /**
   * Get quick stats (all-in-one dashboard)
   * Query: "Show me the dashboard" or "Give me quick stats"
   */
  getQuickStats: async (): Promise<HyperResponse> => {
    const response = await apiClient.get('/hyper/dashboard/quick-stats');
    return response.data;
  },
};

// ============================================================================
// Unified HYPER API Interface
// ============================================================================

export const hyperApi = {
  employeeLifecycle: employeeLifecycleApi,
  recruitment: recruitmentApi,
  attendance: attendanceApi,
  dashboard: dashboardApi,
};
