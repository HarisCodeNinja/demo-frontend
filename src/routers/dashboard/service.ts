import apiClient from '@/services/apiClient';
import { DashboardData } from './interface';

export const getAllDashboardData = async () => {
  const url = '/dashboard';
  return await apiClient.get<DashboardData>(url);
};

export const getOverviewStats = async () => {
  const url = '/dashboard/overview';
  return await apiClient.get(url);
};

export const getEmployeeDistribution = async () => {
  const url = '/dashboard/employees/distribution';
  return await apiClient.get(url);
};

export const getTodayAttendance = async () => {
  const url = '/dashboard/attendance/today';
  return await apiClient.get(url);
};

export const getAttendanceTrend = async () => {
  const url = '/dashboard/attendance/trend';
  return await apiClient.get(url);
};

export const getDepartmentWiseAttendance = async () => {
  const url = '/dashboard/attendance/departments';
  return await apiClient.get(url);
};

export const getLeaveStats = async () => {
  const url = '/dashboard/leaves/stats';
  return await apiClient.get(url);
};

export const getLeaveTypeDistribution = async () => {
  const url = '/dashboard/leaves/types';
  return await apiClient.get(url);
};

export const getMonthlyLeaveDistribution = async () => {
  const url = '/dashboard/leaves/monthly';
  return await apiClient.get(url);
};

export const getRecruitmentStats = async () => {
  const url = '/dashboard/recruitment/stats';
  return await apiClient.get(url);
};

export const getCandidateStatusDistribution = async () => {
  const url = '/dashboard/recruitment/candidates/status';
  return await apiClient.get(url);
};

export const getInterviewStatusDistribution = async () => {
  const url = '/dashboard/recruitment/interviews/status';
  return await apiClient.get(url);
};

export const getPerformanceReviewStats = async () => {
  const url = '/dashboard/performance/stats';
  return await apiClient.get(url);
};

export const getGoalStats = async () => {
  const url = '/dashboard/goals/stats';
  return await apiClient.get(url);
};
