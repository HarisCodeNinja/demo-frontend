export interface DashboardOverviewStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  totalDesignations: number;
}

export interface EmployeeDistribution {
  departmentName: string;
  employeeCount: number;
}

export interface AttendanceStats {
  date: string;
  present: number;
  absent: number;
  late: number;
  totalEmployees: number;
  attendanceRate: number;
}

export interface LeaveStats {
  pending: number;
  approved: number;
  rejected: number;
  totalApplications: number;
}

export interface LeaveTypeDistribution {
  typeName: string;
  count: number;
}

export interface MonthlyLeaveDistribution {
  month: string;
  leaveCount: number;
}

export interface RecruitmentStats {
  totalCandidates: number;
  totalInterviews: number;
  totalOffers: number;
  totalJobOpenings: number;
  activeJobOpenings: number;
}

export interface CandidateStatusDistribution {
  status: string;
  count: number;
}

export interface InterviewStatusDistribution {
  status: string;
  count: number;
}

export interface PerformanceReviewStats {
  pending: number;
  completed: number;
  total: number;
  averageRating?: number;
}

export interface GoalStats {
  draft: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  total: number;
}

export interface DepartmentWiseAttendance {
  departmentName: string;
  present: number;
  absent: number;
  attendanceRate: number;
}

export interface DashboardData {
  overview: DashboardOverviewStats;
  employeeDistribution: EmployeeDistribution[];
  attendance: {
    today: AttendanceStats;
    trend: AttendanceStats[];
    byDepartment: DepartmentWiseAttendance[];
  };
  leaves: {
    stats: LeaveStats;
    typeDistribution: LeaveTypeDistribution[];
    monthlyDistribution: MonthlyLeaveDistribution[];
  };
  recruitment: {
    stats: RecruitmentStats;
    candidateStatus: CandidateStatusDistribution[];
    interviewStatus: InterviewStatusDistribution[];
  };
  performance: PerformanceReviewStats;
  goals: GoalStats;
}
