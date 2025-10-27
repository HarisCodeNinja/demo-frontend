import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  Briefcase,
  CalendarCheck,
  CalendarX,
  Clock,
  TrendingUp,
  FileText,
  CheckCircle2,
  XCircle,
  UserPlus,
  Target,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useAppSelector } from '@/store';

import { getAllDashboardData } from '../dashboard/service';
import { StatsCard } from '../dashboard/components/StatsCard';
import { AttendanceTrendChart } from '../dashboard/components/AttendanceTrendChart';
import { EmployeeDistributionChart } from '../dashboard/components/EmployeeDistributionChart';
import { LeaveTypeChart } from '../dashboard/components/LeaveTypeChart';
import { MonthlyLeaveChart } from '../dashboard/components/MonthlyLeaveChart';
import { DepartmentAttendanceChart } from '../dashboard/components/DepartmentAttendanceChart';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAppSelector((state) => state.session);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await getAllDashboardData();
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
    enabled: isLoggedIn && !!user, // Only fetch if user is logged in
  });

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/userLogin');
    }
  }, [isLoggedIn, user, navigate]);

  // Early return if not authenticated
  if (!isLoggedIn || !user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-80 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load dashboard data: {error instanceof Error ? error.message : 'Unknown error'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { overview, employeeDistribution, attendance, leaves, recruitment, performance, goals } = data;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your HRM dashboard</p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <StatsCard title="Total Employees" value={overview.totalEmployees} icon={Users} description="All employees in the system" />
          <StatsCard title="Active Employees" value={overview.activeEmployees} icon={UserCheck} description="Currently active" />
          <StatsCard title="Inactive" value={overview.inactiveEmployees} icon={UserX} description="Inactive employees" />
          <StatsCard title="Departments" value={overview.totalDepartments} icon={Building2} description="Total departments" />
          <StatsCard title="Designations" value={overview.totalDesignations} icon={Briefcase} description="Total designations" />
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leaves">Leaves</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6 mt-6">
            {/* Today's Attendance Stats */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard title="Present Today" value={attendance.today.present} icon={CalendarCheck} description={`${attendance.today.attendanceRate}% attendance rate`} />
              <StatsCard title="Absent Today" value={attendance.today.absent} icon={CalendarX} description="Employees absent" />
              <StatsCard title="Late Today" value={attendance.today.late} icon={Clock} description="Late arrivals" />
              <StatsCard title="Attendance Rate" value={`${attendance.today.attendanceRate}%`} icon={TrendingUp} description="Today's rate" />
            </div>

            {/* Attendance Charts */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <AttendanceTrendChart data={attendance.trend} />
              <DepartmentAttendanceChart data={attendance.byDepartment} />
            </div>
          </TabsContent>

          {/* Leaves Tab */}
          <TabsContent value="leaves" className="space-y-6 mt-6">
            {/* Leave Stats */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard title="Total Applications" value={leaves.stats.totalApplications} icon={FileText} description="All leave applications" />
              <StatsCard title="Pending" value={leaves.stats.pending} icon={Clock} description="Awaiting approval" />
              <StatsCard title="Approved" value={leaves.stats.approved} icon={CheckCircle2} description="Approved leaves" />
              <StatsCard title="Rejected" value={leaves.stats.rejected} icon={XCircle} description="Rejected leaves" />
            </div>

            {/* Leave Charts */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {leaves.typeDistribution.length > 0 && <LeaveTypeChart data={leaves.typeDistribution} />}
              {leaves.monthlyDistribution.length > 0 && <MonthlyLeaveChart data={leaves.monthlyDistribution} />}
            </div>
          </TabsContent>

          {/* Recruitment Tab */}
          <TabsContent value="recruitment" className="space-y-6 mt-6">
            {/* Recruitment Stats */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              <StatsCard title="Job Openings" value={recruitment.stats.totalJobOpenings} icon={Briefcase} description={`${recruitment.stats.activeJobOpenings} active`} />
              <StatsCard title="Total Candidates" value={recruitment.stats.totalCandidates} icon={UserPlus} description="All candidates" />
              <StatsCard title="Interviews" value={recruitment.stats.totalInterviews} icon={Users} description="Total interviews" />
              <StatsCard title="Offers" value={recruitment.stats.totalOffers} icon={FileText} description="Offer letters sent" />
              <StatsCard title="Active Openings" value={recruitment.stats.activeJobOpenings} icon={TrendingUp} description="Currently hiring" />
            </div>

            {/* Recruitment Details */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {recruitment.candidateStatus.length > 0 && (
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Candidate Status</h3>
                    <div className="space-y-3">
                      {recruitment.candidateStatus.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{item.status}</span>
                          <span className="font-semibold">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
              {recruitment.interviewStatus.length > 0 && (
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Interview Status</h3>
                    <div className="space-y-3">
                      {recruitment.interviewStatus.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{item.status}</span>
                          <span className="font-semibold">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6 mt-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Performance Reviews */}
              <StatsCard title="Total Reviews" value={performance.total} icon={Award} description="All performance reviews" />
              <StatsCard title="Completed" value={performance.completed} icon={CheckCircle2} description="Reviews completed" />
              <StatsCard title="Pending" value={performance.pending} icon={Clock} description="Reviews pending" />
            </div>

            {performance.averageRating && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Average Performance Rating</h3>
                  <p className="text-4xl font-bold text-primary">{performance.averageRating.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground mt-2">Based on completed reviews</p>
                </div>
              </Card>
            )}

            {/* Goals Stats */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Goals Overview</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                <StatsCard title="Total Goals" value={goals.total} icon={Target} description="All goals" />
                <StatsCard title="Draft" value={goals.draft} icon={FileText} description="Not started" />
                <StatsCard title="In Progress" value={goals.inProgress} icon={TrendingUp} description="Currently active" />
                <StatsCard title="Completed" value={goals.completed} icon={CheckCircle2} description="Goals achieved" />
                <StatsCard title="Cancelled" value={goals.cancelled} icon={XCircle} description="Goals cancelled" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Employee Distribution Chart - Always visible */}
        <div className="mt-6">{employeeDistribution.length > 0 && <EmployeeDistributionChart data={employeeDistribution} />}</div>
      </div>
    </div>
  );
};

export default HomePage;
