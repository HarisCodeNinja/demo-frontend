import { IModuleInfo } from './interface';

// MCP-like module context - comprehensive knowledge about the system
export const systemModules: IModuleInfo[] = [
  {
    name: 'Dashboard',
    path: '/',
    description: 'Overview of key metrics including total employees, departments, active job openings, and pending leave applications. Features charts for employee distribution and recent activities.',
    features: [
      'Employee statistics',
      'Department overview',
      'Job opening metrics',
      'Leave application tracking',
      'Interactive charts and graphs',
      'Recent activity feed'
    ]
  },
  {
    name: 'User Management',
    path: '/users',
    description: 'Manage system users with different roles and permissions. Control access and authentication.',
    endpoints: [
      'GET /users - List all users',
      'POST /users - Create new user',
      'PUT /users/{id} - Update user',
      'DELETE /users/{id} - Delete user'
    ],
    features: [
      'User CRUD operations',
      'Role assignment',
      'Permission management',
      'User status control'
    ],
    relatedModules: ['Employees', 'Departments']
  },
  {
    name: 'Departments',
    path: '/departments',
    description: 'Organize company structure by managing departments. Each department can have multiple employees and managers.',
    endpoints: [
      'GET /departments - List departments',
      'POST /departments - Create department',
      'PUT /departments/{id} - Update department',
      'DELETE /departments/{id} - Delete department'
    ],
    features: [
      'Department hierarchy',
      'Manager assignment',
      'Employee allocation',
      'Department metrics'
    ],
    relatedModules: ['Employees', 'Designations', 'Locations']
  },
  {
    name: 'Designations',
    path: '/designations',
    description: 'Define job titles and positions within the organization. Used for role classification and hierarchy.',
    features: [
      'Job title management',
      'Position hierarchy',
      'Role definitions'
    ],
    relatedModules: ['Employees', 'Job Levels', 'Departments']
  },
  {
    name: 'Locations',
    path: '/locations',
    description: 'Manage office locations and work sites. Track where employees are based.',
    features: [
      'Office location tracking',
      'Multi-site management',
      'Location-based reporting'
    ],
    relatedModules: ['Employees', 'Departments']
  },
  {
    name: 'Skills',
    path: '/skills',
    description: 'Define and manage technical and soft skills used across the organization.',
    features: [
      'Skill taxonomy',
      'Skill categorization',
      'Competency tracking'
    ],
    relatedModules: ['Employees', 'Job Openings', 'Candidates', 'Competencies']
  },
  {
    name: 'Employee Management',
    path: '/employees',
    description: 'Central hub for managing employee information including personal details, employment history, and assignments.',
    endpoints: [
      'GET /employees - List employees',
      'GET /employees/detail/{id} - Employee details',
      'POST /employees - Add employee',
      'PUT /employees/{id} - Update employee',
      'DELETE /employees/{id} - Remove employee',
      'GET /employees/select - Employee dropdown',
      'PUT /employees/upload - Bulk upload'
    ],
    features: [
      'Employee profiles',
      'Employment history',
      'Document management',
      'Performance tracking',
      'Bulk import/export'
    ],
    relatedModules: ['Departments', 'Designations', 'Skills', 'Attendance', 'Payslips']
  },
  {
    name: 'Recruitment - Job Openings',
    path: '/job-openings',
    description: 'Create and manage job postings. Define requirements and track hiring progress.',
    features: [
      'Job posting creation',
      'Requirement specification',
      'Application tracking',
      'Hiring pipeline'
    ],
    relatedModules: ['Job Opening Skills', 'Candidates', 'Interviews']
  },
  {
    name: 'Job Opening Skills',
    path: '/job-opening-skills',
    description: 'Link required skills to job openings. Define skill requirements for each position.',
    features: [
      'Skill-job mapping',
      'Requirement levels',
      'Skill gap analysis'
    ],
    relatedModules: ['Job Openings', 'Skills', 'Candidates']
  },
  {
    name: 'Candidate Management',
    path: '/candidates',
    description: 'Track job applicants through the recruitment process. Store resumes and application details.',
    features: [
      'Application tracking',
      'Resume management',
      'Candidate communication',
      'Hiring stages'
    ],
    relatedModules: ['Job Openings', 'Interviews', 'Offer Letters']
  },
  {
    name: 'Candidate Skills',
    path: '/candidate-skills',
    description: 'Record and assess candidate skills. Match candidates to job requirements.',
    features: [
      'Skill assessment',
      'Candidate-job matching',
      'Competency evaluation'
    ],
    relatedModules: ['Candidates', 'Skills', 'Job Openings']
  },
  {
    name: 'Interview Management',
    path: '/interviews',
    description: 'Schedule and track interviews. Record feedback and hiring decisions.',
    features: [
      'Interview scheduling',
      'Interviewer assignment',
      'Feedback collection',
      'Decision tracking'
    ],
    relatedModules: ['Candidates', 'Employees', 'Offer Letters']
  },
  {
    name: 'Offer Letters',
    path: '/offer-letters',
    description: 'Generate and manage employment offer letters. Track offer acceptance status.',
    features: [
      'Offer generation',
      'Template management',
      'Acceptance tracking',
      'Terms and conditions'
    ],
    relatedModules: ['Candidates', 'Interviews', 'Employees']
  },
  {
    name: 'Document Management',
    path: '/documents',
    description: 'Store and organize employee documents. Manage contracts, certificates, and other files.',
    features: [
      'File upload/download',
      'Document categorization',
      'Version control',
      'Access permissions'
    ],
    relatedModules: ['Employees', 'Candidates']
  },
  {
    name: 'Attendance Tracking',
    path: '/attendances',
    description: 'Monitor employee attendance, check-ins, and work hours.',
    features: [
      'Daily attendance logs',
      'Check-in/check-out',
      'Absence tracking',
      'Attendance reports'
    ],
    relatedModules: ['Employees', 'Leave Applications', 'Payslips']
  },
  {
    name: 'Leave Types',
    path: '/leave-types',
    description: 'Configure different types of leave (sick, vacation, personal, etc.) with policies.',
    features: [
      'Leave category setup',
      'Policy configuration',
      'Accrual rules',
      'Balance tracking'
    ],
    relatedModules: ['Leave Applications', 'Employees']
  },
  {
    name: 'Leave Applications',
    path: '/leave-applications',
    description: 'Submit and approve employee leave requests. Track leave balances.',
    features: [
      'Leave request submission',
      'Approval workflow',
      'Balance management',
      'Leave calendar'
    ],
    relatedModules: ['Leave Types', 'Employees', 'Attendance']
  },
  {
    name: 'Salary Structures',
    path: '/salary-structures',
    description: 'Define compensation packages and salary components for different roles.',
    features: [
      'Salary component setup',
      'Package templates',
      'Compensation planning',
      'Grade structures'
    ],
    relatedModules: ['Employees', 'Payslips', 'Job Levels']
  },
  {
    name: 'Payslips',
    path: '/payslips',
    description: 'Generate and distribute employee payslips. Calculate salaries and deductions.',
    features: [
      'Payslip generation',
      'Salary calculation',
      'Deduction management',
      'Payment history'
    ],
    relatedModules: ['Employees', 'Salary Structures', 'Attendance']
  },
  {
    name: 'Goal Management',
    path: '/goals',
    description: 'Set and track employee goals and objectives aligned with company targets.',
    features: [
      'Goal setting',
      'Progress tracking',
      'Alignment with OKRs',
      'Performance metrics'
    ],
    relatedModules: ['Employees', 'Performance Reviews']
  },
  {
    name: 'Performance Reviews',
    path: '/performance-reviews',
    description: 'Conduct periodic employee performance evaluations and feedback sessions.',
    features: [
      'Review scheduling',
      'Rating systems',
      'Feedback collection',
      '360-degree reviews',
      'Development plans'
    ],
    relatedModules: ['Employees', 'Goals', 'Competencies']
  },
  {
    name: 'Job Levels',
    path: '/job-levels',
    description: 'Define career progression levels and hierarchies within the organization.',
    features: [
      'Level definitions',
      'Career ladders',
      'Progression criteria',
      'Compensation bands'
    ],
    relatedModules: ['Employees', 'Designations', 'Salary Structures']
  },
  {
    name: 'Competencies',
    path: '/competencies',
    description: 'Define core competencies and behavioral indicators for roles.',
    features: [
      'Competency framework',
      'Behavioral indicators',
      'Proficiency levels',
      'Assessment criteria'
    ],
    relatedModules: ['Skills', 'Role Competencies', 'Performance Reviews']
  },
  {
    name: 'Role Competencies',
    path: '/role-competencies',
    description: 'Map required competencies to specific roles and job levels.',
    features: [
      'Role-competency mapping',
      'Requirement definitions',
      'Gap analysis',
      'Role profiles'
    ],
    relatedModules: ['Competencies', 'Designations', 'Employee Competencies']
  },
  {
    name: 'Employee Competencies',
    path: '/employee-competencies',
    description: 'Track and assess individual employee competencies and skill development.',
    features: [
      'Competency assessment',
      'Skill gap identification',
      'Development tracking',
      'Certification management'
    ],
    relatedModules: ['Employees', 'Competencies', 'Learning Plans']
  },
  {
    name: 'Learning Plans',
    path: '/learning-plans',
    description: 'Create personalized learning and development plans for employees.',
    features: [
      'Training program assignment',
      'Learning path creation',
      'Progress tracking',
      'Certification goals',
      'Skill development roadmap'
    ],
    relatedModules: ['Employees', 'Employee Competencies', 'Skills']
  },
  {
    name: 'User Profile',
    path: '/userProfile',
    description: 'Manage personal user settings, preferences, and account information.',
    features: [
      'Profile editing',
      'Password change',
      'Notification settings',
      'Theme preferences'
    ],
    relatedModules: ['User Management']
  }
];

// Helper function to find modules by keyword
export const findModulesByKeyword = (keyword: string): IModuleInfo[] => {
  const lowerKeyword = keyword.toLowerCase();
  return systemModules.filter(module =>
    module.name.toLowerCase().includes(lowerKeyword) ||
    module.description.toLowerCase().includes(lowerKeyword) ||
    module.features?.some(f => f.toLowerCase().includes(lowerKeyword)) ||
    module.relatedModules?.some(r => r.toLowerCase().includes(lowerKeyword))
  );
};

// Helper function to get module by path
export const getModuleByPath = (path: string): IModuleInfo | undefined => {
  return systemModules.find(module => module.path === path);
};

// Helper function to get related modules
export const getRelatedModules = (moduleName: string): IModuleInfo[] => {
  const module = systemModules.find(m => m.name === moduleName);
  if (!module || !module.relatedModules) return [];

  return systemModules.filter(m =>
    module.relatedModules?.includes(m.name)
  );
};
