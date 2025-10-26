export type Action = 'view' | 'edit' | 'add' | 'delete' | 'upload' | 'detail';

		 type ObjectAccessRights = {
			 [object: string]: Action[];
		 };
		 
		 type AccessRights = {
			 [scope: string]: ObjectAccessRights;
		 };
		 
		 export const accessRights : AccessRights = {
  '_user:admin': {
    attendance: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    auditLog: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    candidate: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    candidateSkill: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    competency: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    department: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    designation: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    document: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    employeeCompetency: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    employee: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    goal: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    interview: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    jobLevel: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    jobOpening: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    jobOpeningSkill: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    learningPlan: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    leaveApplication: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    leaveType: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    location: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    offerLetter: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    payslip: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    performanceReview: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    roleCompetency: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    salaryStructure: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    skill: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    user: ['add', 'delete', 'detail', 'edit', 'upload', 'view']
  },
  '_user:hr': {
    attendance: ['detail', 'edit', 'upload', 'view'],
    auditLog: ['detail', 'view'],
    candidate: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    candidateSkill: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    competency: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    department: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    designation: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    document: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    employeeCompetency: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    employee: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    goal: ['detail', 'edit', 'upload', 'view'],
    interview: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    jobLevel: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    jobOpening: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    jobOpeningSkill: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    learningPlan: ['detail', 'edit', 'upload', 'view'],
    leaveApplication: ['detail', 'edit', 'upload', 'view'],
    leaveType: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    location: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    offerLetter: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    payslip: ['add', 'detail', 'edit', 'upload', 'view'],
    performanceReview: ['detail', 'edit', 'upload', 'view'],
    roleCompetency: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    salaryStructure: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    skill: ['add', 'delete', 'detail', 'edit', 'upload', 'view'],
    user: ['detail', 'edit', 'upload', 'view']
  },
  '_user:manager': {
    attendance: ['detail', 'view'],
    employee: ['detail', 'edit', 'upload', 'view'],
    goal: ['add', 'detail', 'edit', 'upload', 'view'],
    learningPlan: ['add', 'detail', 'edit', 'upload', 'view'],
    leaveApplication: ['detail', 'edit', 'upload', 'view'],
    performanceReview: ['add', 'detail', 'edit', 'upload', 'view']
  },
  '_user:employee': {
    attendance: ['add', 'detail', 'upload', 'view'],
    document: ['add', 'detail', 'upload', 'view'],
    employee: ['detail'],
    goal: ['detail', 'edit', 'upload', 'view'],
    jobOpening: ['detail', 'view'],
    learningPlan: ['detail', 'view'],
    leaveApplication: ['add', 'detail', 'edit', 'upload', 'view'],
    payslip: ['detail', 'view'],
    performanceReview: ['detail', 'edit', 'upload', 'view'],
    user: ['detail', 'edit', 'upload']
  }
};