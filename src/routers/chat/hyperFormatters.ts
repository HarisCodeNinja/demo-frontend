import { HyperResponse } from './hyperApi';

/**
 * HYPER Response Formatters
 * Converts HYPER API responses into user-friendly markdown messages
 */

// ============================================================================
// Employee Lifecycle Formatters
// ============================================================================

export function formatMissingDocuments(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `✅ Great news! All employees have complete documentation.`;
  }

  let message = `# 📄 Missing Documents Report\n\n`;
  message += `**${meta.message}**\n\n`;

  data.forEach((employee: any, index: number) => {
    message += `## ${index + 1}. ${employee.employeeName}\n`;
    message += `- **Department:** ${employee.department}\n`;
    message += `- **Days Overdue:** ${employee.daysOverdue} days\n`;
    message += `- **Missing:**\n`;
    employee.missingDocuments.forEach((doc: string) => {
      message += `  - ${doc}\n`;
    });
    message += `\n`;
  });

  message += `\n**Action Required:** Please follow up with these employees to complete their documentation.`;

  return message;
}

export function formatIncompleteOnboarding(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `✅ All employees have completed onboarding!`;
  }

  let message = `# 🎯 Incomplete Onboarding\n\n`;
  message += `**${meta.message}**\n\n`;

  data.forEach((employee: any, index: number) => {
    const progress = Math.round(employee.completionPercentage);
    const progressBar = '█'.repeat(Math.floor(progress / 10)) + '░'.repeat(10 - Math.floor(progress / 10));

    message += `## ${index + 1}. ${employee.employeeName}\n`;
    message += `- **Joined:** ${new Date(employee.joinDate).toLocaleDateString()}\n`;
    message += `- **Days Delayed:** ${employee.daysDelayed} days\n`;
    message += `- **Progress:** ${progressBar} ${progress}%\n`;
    message += `- **Pending Items:**\n`;
    employee.pendingItems.forEach((item: string) => {
      message += `  - [ ] ${item}\n`;
    });
    message += `\n`;
  });

  return message;
}

export function formatRoleMismatches(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `✅ No role mismatches found! All employee records are consistent.`;
  }

  let message = `# ⚠️ Role Mismatches\n\n`;
  message += `**${meta.message}**\n\n`;

  data.forEach((employee: any, index: number) => {
    message += `## ${index + 1}. ${employee.employeeName}\n`;
    message += `- **Department:** ${employee.department}\n`;
    message += `- **HRM Role:** ${employee.hrmRole}\n`;
    message += `- **Payroll Role:** ${employee.payrollRole}\n`;
    message += `- **Issue:** ${employee.issueType.replace(/_/g, ' ')}\n\n`;
  });

  message += `**Action Required:** Please sync role information between HRM and Payroll systems.`;

  return message;
}

export function formatNewHires(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `No new hires found for the specified period.`;
  }

  let message = `# 👋 New Hires Summary\n\n`;
  message += `**${meta.message}**\n\n`;

  if (meta.summary) {
    message += `**Onboarding Status:**\n`;
    message += `- 🔴 Not Started: ${meta.summary.notStarted}\n`;
    message += `- 🟡 In Progress: ${meta.summary.inProgress}\n`;
    message += `- 🟢 Completed: ${meta.summary.completed}\n\n`;
  }

  data.forEach((employee: any, index: number) => {
    const statusEmoji =
      {
        not_started: '🔴',
        in_progress: '🟡',
        completed: '🟢',
      }[employee.onboardingStatus as 'not_started' | 'in_progress' | 'completed'] || '⚪';

    message += `## ${index + 1}. ${employee.employeeName} ${statusEmoji}\n`;
    message += `- **Designation:** ${employee.designation}\n`;
    message += `- **Department:** ${employee.department}\n`;
    message += `- **Joined:** ${new Date(employee.joinDate).toLocaleDateString()}\n`;
    message += `- **Days with Company:** ${employee.daysWithCompany} days\n`;
    if (employee.assignedMentor) {
      message += `- **Mentor:** ${employee.assignedMentor}\n`;
    }
    message += `\n`;
  });

  return message;
}

// ============================================================================
// Recruitment Formatters
// ============================================================================

export function formatPendingFeedback(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `✅ All interview feedbacks are up to date!`;
  }

  let message = `# 📝 Interviews Pending Feedback\n\n`;
  message += `**${meta.message}**\n\n`;

  data.forEach((interview: any, index: number) => {
    message += `## ${index + 1}. ${interview.candidateName}\n`;
    message += `- **Job:** ${interview.jobTitle}\n`;
    message += `- **Interviewer:** ${interview.interviewerName}\n`;
    message += `- **Interview Date:** ${new Date(interview.interviewDate).toLocaleDateString()}\n`;
    message += `- **Round:** ${interview.interviewRound}\n`;
    message += `- **⏱️ Days Pending:** ${interview.daysPending} days\n\n`;
  });

  message += `**Action Required:** Please remind interviewers to submit their feedback.`;

  return message;
}

export function formatCandidateMatching(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `No matching candidates found for this position.`;
  }

  let message = `# 🎯 Best Matching Candidates\n\n`;
  message += `**Job:** ${meta.jobTitle}\n`;
  message += `**Required Skills:** ${meta.requiredSkills?.join(', ')}\n`;
  message += `**${meta.message}**\n\n`;

  data.slice(0, 10).forEach((candidate: any, index: number) => {
    const matchBar = '█'.repeat(Math.floor(candidate.matchScore / 10)) + '░'.repeat(10 - Math.floor(candidate.matchScore / 10));

    message += `## ${index + 1}. ${candidate.candidateName} (${candidate.matchScore}%)\n`;
    message += `${matchBar}\n\n`;
    message += `- **Email:** ${candidate.email}\n`;
    message += `- **Phone:** ${candidate.phone}\n`;
    message += `- **Experience:** ${candidate.experienceYears} years\n`;
    message += `- **Current Stage:** ${candidate.currentStage}\n`;
    message += `- **Applied:** ${new Date(candidate.appliedDate).toLocaleDateString()}\n`;
    message += `- **✅ Matching Skills:** ${candidate.matchingSkills.join(', ')}\n`;
    if (candidate.missingSkills.length > 0) {
      message += `- **⚠️ Missing Skills:** ${candidate.missingSkills.join(', ')}\n`;
    }
    message += `\n`;
  });

  return message;
}

export function formatHiringFunnel(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `No hiring data available for the specified period.`;
  }

  let message = `# 📊 Hiring Funnel\n\n`;
  message += `**${meta.message}**\n\n`;

  data.forEach((stage: any) => {
    const bar = '█'.repeat(Math.floor(stage.percentage / 5)) + '░'.repeat(20 - Math.floor(stage.percentage / 5));
    message += `### ${stage.stage}\n`;
    message += `${bar} ${stage.count} (${stage.percentage.toFixed(1)}%)\n`;
    if (stage.avgDaysInStage > 0) {
      message += `*Avg. days in stage: ${stage.avgDaysInStage}*\n`;
    }
    message += `\n`;
  });

  return message;
}

export function formatPipelineSummary(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `No active job openings at the moment.`;
  }

  let message = `# 🚀 Recruitment Pipeline\n\n`;
  message += `**${meta.message}**\n\n`;

  data.forEach((job: any, index: number) => {
    message += `## ${index + 1}. ${job.jobTitle}\n`;
    message += `- **Department:** ${job.department}\n`;
    message += `- **Days Open:** ${job.daysOpen} days\n`;
    message += `- **Total Applicants:** ${job.totalApplicants}\n`;
    message += `- **Pipeline:**\n`;
    message += `  - 🆕 New: ${job.newApplications}\n`;
    message += `  - ⭐ Shortlisted: ${job.shortlisted}\n`;
    message += `  - 🎤 Interviewing: ${job.interviewing}\n`;
    message += `  - 📄 Offered: ${job.offered}\n`;
    message += `  - ✅ Hired: ${job.hired}\n`;
    message += `  - ❌ Rejected: ${job.rejected}\n\n`;
  });

  return message;
}

// ============================================================================
// Attendance Formatters
// ============================================================================

export function formatTodayAttendance(response: HyperResponse): string {
  const { data, meta } = response;

  let message = `# 📅 ${meta.message}\n\n`;

  message += `## Overall Statistics\n`;
  message += `- **Total Employees:** ${data.totalEmployees}\n`;
  message += `- **✅ Present:** ${data.present} (${data.attendancePercentage.toFixed(1)}%)\n`;
  message += `- **❌ Absent:** ${data.absent}\n`;
  message += `- **⏰ Late:** ${data.late}\n`;
  message += `- **🏖️ On Leave:** ${data.onLeave}\n\n`;

  if (data.departments && data.departments.length > 0) {
    message += `## Department Breakdown\n\n`;
    data.departments.forEach((dept: any) => {
      const bar = '█'.repeat(Math.floor(dept.percentage / 5)) + '░'.repeat(20 - Math.floor(dept.percentage / 5));
      message += `**${dept.departmentName}**\n`;
      message += `${bar} ${dept.present}/${dept.total} (${dept.percentage.toFixed(1)}%)\n\n`;
    });
  }

  return message;
}

export function formatAbsenteePatterns(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `✅ No concerning absentee patterns detected.`;
  }

  let message = `# 🔍 Absentee Patterns\n\n`;
  message += `**${meta.message}**\n\n`;

  data.forEach((employee: any, index: number) => {
    message += `## ${index + 1}. ${employee.employeeName}\n`;
    message += `- **Department:** ${employee.department}\n`;
    message += `- **Total Absences:** ${employee.totalAbsences}\n`;
    if (employee.consecutiveAbsences > 0) {
      message += `- **⚠️ Consecutive Absences:** ${employee.consecutiveAbsences}\n`;
    }
    message += `- **Pattern:** ${employee.pattern}\n\n`;
  });

  message += `**Recommendation:** Review attendance policies with these employees.`;

  return message;
}

export function formatLateComers(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `✅ No late arrivals today!`;
  }

  let message = `# ⏰ Late Comers\n\n`;
  message += `**${meta.message}**\n\n`;

  data.forEach((employee: any, index: number) => {
    message += `## ${index + 1}. ${employee.employeeName}\n`;
    message += `- **Department:** ${employee.department}\n`;
    message += `- **Manager:** ${employee.manager}\n`;
    message += `- **Scheduled Time:** ${employee.scheduledTime}\n`;
    message += `- **Actual Check-in:** ${employee.checkInTime}\n`;
    message += `- **⏱️ Minutes Late:** ${employee.minutesLate}\n`;
    message += `- **Late Count (7 days):** ${employee.lateCount7Days}\n`;
    message += `- **Late Count (30 days):** ${employee.lateCount30Days}\n\n`;
  });

  return message;
}

export function formatAttendanceAnomalies(response: HyperResponse): string {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    return `✅ No attendance anomalies detected!`;
  }

  let message = `# 🚨 Attendance Anomalies\n\n`;
  message += `**${meta.message}**\n\n`;

  const grouped = data.reduce((acc: any, anomaly: any) => {
    if (!acc[anomaly.type]) acc[anomaly.type] = [];
    acc[anomaly.type].push(anomaly);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([type, anomalies]: [string, any]) => {
    message += `## ${type.replace(/_/g, ' ').toUpperCase()}\n\n`;
    anomalies.forEach((anomaly: any) => {
      const severityEmoji = { high: '🔴', medium: '🟡', low: '🟢' }[anomaly.severity] || '⚪';
      message += `${severityEmoji} **${anomaly.employeeName}** (${anomaly.department})\n`;
      message += `- Date: ${new Date(anomaly.date).toLocaleDateString()}\n`;
      message += `- Details: ${anomaly.details}\n\n`;
    });
  });

  message += `**Action Required:** Review and address these anomalies.`;

  return message;
}

// ============================================================================
// Dashboard Formatters
// ============================================================================

export function formatHeadcount(response: HyperResponse): string {
  const { data, meta } = response;

  let message = `# 👥 ${meta.message}\n\n`;

  message += `**Total Employees:** ${data.totalEmployees}\n\n`;

  if (data.byDepartment && data.byDepartment.length > 0) {
    message += `## By Department\n\n`;
    data.byDepartment.forEach((dept: any) => {
      const bar = '█'.repeat(Math.floor(dept.percentage / 3.33)) + '░'.repeat(30 - Math.floor(dept.percentage / 3.33));
      message += `**${dept.departmentName}**\n`;
      message += `${bar} ${dept.count} (${dept.percentage.toFixed(1)}%)\n\n`;
    });
  }

  if (data.byDesignation && data.byDesignation.length > 0) {
    message += `## Top Designations\n\n`;
    data.byDesignation.slice(0, 5).forEach((desig: any) => {
      message += `- **${desig.designationName}:** ${desig.count} (${desig.percentage.toFixed(1)}%)\n`;
    });
    message += `\n`;
  }

  if (data.byLocation && data.byLocation.length > 0) {
    message += `## By Location\n\n`;
    data.byLocation.forEach((loc: any) => {
      message += `- **${loc.locationName}:** ${loc.count} (${loc.percentage.toFixed(1)}%)\n`;
    });
  }

  return message;
}

export function formatQuickStats(response: HyperResponse): string {
  const { data } = response;

  let message = `# 📊 Dashboard Overview\n\n`;

  message += `## 👥 Employees\n`;
  message += `- **Total:** ${data.employees.total}\n`;
  message += `- **Active:** ${data.employees.active}\n`;
  message += `- **On Leave Today:** ${data.employees.onLeaveToday}\n`;
  message += `- **New Hires This Month:** ${data.employees.newHiresThisMonth}\n\n`;

  message += `## 📅 Attendance\n`;
  message += `- **Present Today:** ${data.attendance.todayPresent}\n`;
  message += `- **Absent Today:** ${data.attendance.todayAbsent}\n`;
  message += `- **Attendance Rate:** ${data.attendance.attendanceRate.toFixed(1)}%\n\n`;

  message += `## 🎯 Recruitment\n`;
  message += `- **Open Positions:** ${data.recruitment.openPositions}\n`;
  message += `- **Total Candidates:** ${data.recruitment.totalCandidates}\n`;
  message += `- **Interviews This Week:** ${data.recruitment.interviewsThisWeek}\n\n`;

  message += `## 🏖️ Leaves\n`;
  message += `- **Pending Approvals:** ${data.leaves.pendingApprovals}\n`;
  message += `- **Approved This Month:** ${data.leaves.approvedThisMonth}\n\n`;

  message += `## 📈 Performance\n`;
  message += `- **Reviews Due:** ${data.performance.reviewsDue}\n`;
  message += `- **Goals Overdue:** ${data.performance.goalsOverdue}\n`;

  return message;
}

// ============================================================================
// Master Formatter Router
// ============================================================================

export function formatHyperResponse(response: HyperResponse, category: string): string {
  try {
    // Route to appropriate formatter based on response structure or category
    const { data } = response;

    // Employee Lifecycle
    if (data && Array.isArray(data) && data[0]?.missingDocuments) {
      return formatMissingDocuments(response);
    }
    if (data && Array.isArray(data) && data[0]?.completionPercentage !== undefined) {
      return formatIncompleteOnboarding(response);
    }
    if (data && Array.isArray(data) && data[0]?.hrmRole && data[0]?.payrollRole) {
      return formatRoleMismatches(response);
    }
    if (data && Array.isArray(data) && data[0]?.onboardingStatus) {
      return formatNewHires(response);
    }

    // Recruitment
    if (data && Array.isArray(data) && data[0]?.interviewDate) {
      return formatPendingFeedback(response);
    }
    if (data && Array.isArray(data) && data[0]?.matchScore !== undefined) {
      return formatCandidateMatching(response);
    }
    if (data && Array.isArray(data) && data[0]?.stage) {
      return formatHiringFunnel(response);
    }
    if (data && Array.isArray(data) && data[0]?.totalApplicants !== undefined) {
      return formatPipelineSummary(response);
    }

    // Attendance
    if (data && data.totalEmployees && data.present !== undefined) {
      return formatTodayAttendance(response);
    }
    if (data && Array.isArray(data) && data[0]?.totalAbsences) {
      return formatAbsenteePatterns(response);
    }
    if (data && Array.isArray(data) && data[0]?.minutesLate) {
      return formatLateComers(response);
    }
    if (data && Array.isArray(data) && data[0]?.type && data[0]?.severity) {
      return formatAttendanceAnomalies(response);
    }

    // Dashboard
    if (data && data.totalEmployees && data.byDepartment) {
      return formatHeadcount(response);
    }
    if (data && data.employees && data.attendance && data.recruitment) {
      return formatQuickStats(response);
    }

    // Fallback - return meta message with JSON
    return `${response.meta.message}\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
  } catch (error) {
    console.error('Error formatting HYPER response:', error);
    return `✅ ${response.meta.message}`;
  }
}
