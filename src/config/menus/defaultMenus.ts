import { MenuItem } from '@/interface/common';
import * as LucideIcons from 'lucide-react';

export const authMenus: MenuItem[] = [
  {
    label: 'user',
    key: '/userLogin',
    scope: [],
  },
];
export const defaultMenus: MenuItem[] = [
  {
    key: '/',
    label: 'Dashboard',
    scope: ['user:admin', 'user:hr', 'user:manager', 'user:employee'],
    icon: LucideIcons.LayoutDashboard,
  },
  {
    key: '/chat',
    label: 'AI Assistant',
    scope: ['user:admin', 'user:hr', 'user:manager', 'user:employee'],
    icon: LucideIcons.MessageSquare,
  },
  {
    key: '/users',
    label: 'Users',
    scope: ['user:admin', 'user:hr'],
  },
  {
    key: '/departments',
    label: 'Departments',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.Building2,
  },
  {
    key: '/designations',
    label: 'Designations',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.Briefcase,
  },
  {
    key: '/locations',
    label: 'Locations',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.LucideMapPin,
  },
  {
    key: '/skills',
    label: 'Skills',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.Lightbulb,
  },
  {
    key: '/employees',
    label: 'Employees',
    scope: ['user:admin', 'user:hr', 'user:manager'],
    icon: LucideIcons.LucideUsers,
  },
  {
    key: '/job-openings',
    label: 'Job Openings',
    scope: ['user:admin', 'user:hr', 'user:employee'],
    icon: LucideIcons.FileBadge,
  },
  {
    key: '/job-opening-skills',
    label: 'Job Opening Skills',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.Settings2,
  },
  {
    key: '/candidates',
    label: 'Candidates',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.LucideUserSearch,
  },
  {
    key: '/candidate-skills',
    label: 'Candidate Skills',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.UserCog,
  },
  {
    key: '/interviews',
    label: 'Interviews',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.LucideMic,
  },
  {
    key: '/offer-letters',
    label: 'Offer Letters',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.FileText,
  },
  {
    key: '/documents',
    label: 'Documents',
    scope: ['user:admin', 'user:hr', 'user:employee'],
    icon: LucideIcons.FileArchive,
  },
  {
    key: '/attendances',
    label: 'Attendance',
    scope: ['user:admin', 'user:hr', 'user:manager', 'user:employee'],
    icon: LucideIcons.CalendarCheck,
  },
  {
    key: '/leave-types',
    label: 'Leave Types',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.ListChecks,
  },
  {
    key: '/leave-applications',
    label: 'Leave Applications',
    scope: ['user:admin', 'user:hr', 'user:manager', 'user:employee'],
    icon: LucideIcons.LucidePlaneTakeoff,
  },
  {
    key: '/salary-structures',
    label: 'Salary Structures',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.LucideWallet,
  },
  {
    key: '/payslips',
    label: 'Payslips',
    scope: ['user:admin', 'user:hr', 'user:employee'],
    icon: LucideIcons.LucideReceiptText,
  },
  {
    key: '/goals',
    label: 'Goals',
    scope: ['user:admin', 'user:hr', 'user:manager', 'user:employee'],
    icon: LucideIcons.Flag,
  },
  {
    key: '/performance-reviews',
    label: 'Performance Reviews',
    scope: ['user:admin', 'user:hr', 'user:manager', 'user:employee'],
    icon: LucideIcons.ChartLine,
  },
  {
    key: '/job-levels',
    label: 'Job Levels',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.Layers3,
  },
  {
    key: '/competencies',
    label: 'Competencies',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.Trophy,
  },
  {
    key: '/role-competencies',
    label: 'Role Competencies',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.Award,
  },
  {
    key: '/employee-competencies',
    label: 'Employee Competencies',
    scope: ['user:admin', 'user:hr'],
    icon: LucideIcons.Target,
  },
  {
    key: '/learning-plans',
    label: 'Learning Plans',
    scope: ['user:admin', 'user:hr', 'user:manager', 'user:employee'],
    icon: LucideIcons.BookOpenCheck,
  },
];
