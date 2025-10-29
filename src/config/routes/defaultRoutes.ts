import React from 'react';
import { CustomRoutes } from '@/interface/common';

export const publicRoutes: CustomRoutes[] = [
  {
    key: '/',
    path: '/',
    component: React.lazy(() => import('@/routers/user-auth/login')),
  },
  {
    key: 'userLogin',
    path: '/userLogin',
    component: React.lazy(() => import('@/routers/user-auth/login')),
  },
  {
    key: 'userRegister',
    path: '/userRegister',
    component: React.lazy(() => import('@/routers/user-auth/register')),
  },
  {
    key: 'userForgotPassword',
    path: '/userForgotPassword',
    component: React.lazy(() => import('@/routers/user-auth/forgot-password')),
  },
  {
    key: 'userResetPassword',
    path: '/userResetPassword',
    component: React.lazy(() => import('@/routers/user-auth/reset-password')),
  },
];

export const defaultRoutes: CustomRoutes[] = [
  {
    key: 'attendance',
    path: '/attendances',
    component: React.lazy(() => import('@/routers/attendance')),
  },
  {
    key: 'candidate',
    path: '/candidates',
    component: React.lazy(() => import('@/routers/candidate')),
  },
  {
    key: 'candidate-skill',
    path: '/candidate-skills',
    component: React.lazy(() => import('@/routers/candidate-skill')),
  },
  {
    key: 'competency',
    path: '/competencies',
    component: React.lazy(() => import('@/routers/competency')),
  },
  {
    key: 'department',
    path: '/departments',
    component: React.lazy(() => import('@/routers/department')),
  },
  {
    key: 'designation',
    path: '/designations',
    component: React.lazy(() => import('@/routers/designation')),
  },
  {
    key: 'document',
    path: '/documents',
    component: React.lazy(() => import('@/routers/document')),
  },
  {
    key: 'employee-competency',
    path: '/employee-competencies',
    component: React.lazy(() => import('@/routers/employee-competency')),
  },
  {
    key: 'employee',
    path: '/employees',
    component: React.lazy(() => import('@/routers/employee')),
  },
  {
    key: 'goal',
    path: '/goals',
    component: React.lazy(() => import('@/routers/goal')),
  },
  {
    key: 'interview',
    path: '/interviews',
    component: React.lazy(() => import('@/routers/interview')),
  },
  {
    key: 'job-level',
    path: '/job-levels',
    component: React.lazy(() => import('@/routers/job-level')),
  },
  {
    key: 'job-opening',
    path: '/job-openings',
    component: React.lazy(() => import('@/routers/job-opening')),
  },
  {
    key: 'job-opening-skill',
    path: '/job-opening-skills',
    component: React.lazy(() => import('@/routers/job-opening-skill')),
  },
  {
    key: 'learning-plan',
    path: '/learning-plans',
    component: React.lazy(() => import('@/routers/learning-plan')),
  },
  {
    key: 'leave-application',
    path: '/leave-applications',
    component: React.lazy(() => import('@/routers/leave-application')),
  },
  {
    key: 'leave-type',
    path: '/leave-types',
    component: React.lazy(() => import('@/routers/leave-type')),
  },
  {
    key: 'location',
    path: '/locations',
    component: React.lazy(() => import('@/routers/location')),
  },
  {
    key: 'offer-letter',
    path: '/offer-letters',
    component: React.lazy(() => import('@/routers/offer-letter')),
  },
  {
    key: 'payslip',
    path: '/payslips',
    component: React.lazy(() => import('@/routers/payslip')),
  },
  {
    key: 'performance-review',
    path: '/performance-reviews',
    component: React.lazy(() => import('@/routers/performance-review')),
  },
  {
    key: 'role-competency',
    path: '/role-competencies',
    component: React.lazy(() => import('@/routers/role-competency')),
  },
  {
    key: 'salary-structure',
    path: '/salary-structures',
    component: React.lazy(() => import('@/routers/salary-structure')),
  },
  {
    key: 'skill',
    path: '/skills',
    component: React.lazy(() => import('@/routers/skill')),
  },
  {
    key: 'user',
    path: '/users',
    component: React.lazy(() => import('@/routers/user')),
  },
  {
    key: 'userProfile',
    path: '/userProfile',
    component: React.lazy(() => import('@/routers/user-auth/profile')),
  },
  // {
  //   key: 'userChangePassword',
  //   path: '/userChangePassword',
  //   component: React.lazy(() => import('@/routers/user-auth/profile/change-password')),
  // },
];

export default defaultRoutes;
