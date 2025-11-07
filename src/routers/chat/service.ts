import { IMessage, IChatRequest, IChatResponse, IModuleInfo } from './interface';
import { systemModules, findModulesByKeyword, getModuleByPath, getRelatedModules } from './moduleContext';
import { shouldUseHyperApi, routeHyperQuery } from './hyperQueryRouter';
import { formatHyperResponse } from './hyperFormatters';

// MCP-like intelligent response generator with HYPER API integration
export class ChatService {
  private conversationHistory: IMessage[] = [];

  // Main method to process user queries
  async sendMessage(request: IChatRequest): Promise<IChatResponse> {
    const userMessage: IMessage = {
      id: this.generateId(),
      role: 'user',
      content: request.message,
      timestamp: new Date(),
      moduleContext: request.moduleContext
    };

    this.conversationHistory.push(userMessage);

    // Analyze intent and generate response
    const response = await this.generateResponse(request.message, request.moduleContext);

    const assistantMessage: IMessage = {
      id: this.generateId(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions
    };

    this.conversationHistory.push(assistantMessage);

    return {
      message: assistantMessage,
      suggestions: response.suggestions,
      relatedModules: response.relatedModules
    };
  }

  // Generate intelligent responses based on query analysis
  private async generateResponse(
    query: string,
    moduleContext?: string
  ): Promise<{ content: string; suggestions?: string[]; relatedModules?: IModuleInfo[] }> {
    const lowerQuery = query.toLowerCase();

    // ============================================================================
    // HYPER API Integration - Check if query should use real backend data
    // ============================================================================
    console.log('[HYPER] Checking query:', query);
    console.log('[HYPER] Should use HYPER API:', shouldUseHyperApi(query));

    if (shouldUseHyperApi(query)) {
      try {
        console.log('[HYPER] Routing query to endpoint...');
        const queryMatch = await routeHyperQuery(query);

        console.log('[HYPER] Query match result:', {
          matched: queryMatch.matched,
          category: queryMatch.category,
          params: queryMatch.params
        });

        if (queryMatch.matched) {
          console.log('[HYPER] Calling API endpoint...');

          // Call the HYPER API endpoint
          const hyperResponse = await queryMatch.endpoint();

          console.log('[HYPER] API response received:', {
            hasData: !!hyperResponse.data,
            message: hyperResponse.meta?.message
          });

          // Format the response into readable markdown
          const formattedContent = formatHyperResponse(hyperResponse, queryMatch.category);

          // Generate contextual suggestions based on category
          const suggestions = this.generateHyperSuggestions(queryMatch.category);

          return {
            content: formattedContent,
            suggestions,
            relatedModules: []
          };
        } else {
          console.log('[HYPER] No matching endpoint found for query');
        }
      } catch (error) {
        console.error('[HYPER] Error calling HYPER API:', error);

        // Check if it's a network error
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any;
          console.error('[HYPER] API Error Details:', {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
            url: axiosError.config?.url
          });
        }

        // Fall through to static responses if API fails
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: `⚠️ I encountered an issue fetching real-time data: ${errorMessage}\n\n**Debug Info:**\n- Query: "${query}"\n- Category: Would route to HYPER API\n- Error: ${error instanceof Error ? error.stack : String(error)}\n\n**Possible causes:**\n1. Backend server might not be running\n2. HYPER endpoints might not be implemented yet\n3. Authentication issue\n4. Network/CORS issue\n\nPlease check the browser console for more details.`,
          suggestions: [
            'Show me the dashboard',
            'What modules are available?',
            'How do I manage employees?'
          ],
          relatedModules: []
        };
      }
    }

    // Intent detection - order matters!
    if (this.isGreeting(lowerQuery)) {
      return this.handleGreeting();
    }

    // Check for specific workflows first (before general module query)
    if (this.isWorkflowQuery(lowerQuery)) {
      return this.handleWorkflowQuery(lowerQuery);
    }

    if (this.isHowToQuery(lowerQuery)) {
      return this.handleHowToQuery(lowerQuery);
    }

    if (this.isModuleQuery(lowerQuery)) {
      return this.handleModuleQuery(lowerQuery, moduleContext);
    }

    if (this.isFeatureQuery(lowerQuery)) {
      return this.handleFeatureQuery(lowerQuery);
    }

    if (this.isNavigationQuery(lowerQuery)) {
      return this.handleNavigationQuery(lowerQuery);
    }

    if (this.isComparisonQuery(lowerQuery)) {
      return this.handleComparisonQuery(lowerQuery);
    }

    // Default fallback
    return this.handleGeneralQuery(lowerQuery);
  }

  // Intent detection methods
  private isGreeting(query: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(g => query.includes(g));
  }

  private isModuleQuery(query: string): boolean {
    const moduleKeywords = ['module', 'what is', 'tell me about', 'explain', 'describe'];
    return moduleKeywords.some(k => query.includes(k)) ||
           systemModules.some(m => query.includes(m.name.toLowerCase()));
  }

  private isFeatureQuery(query: string): boolean {
    const featureKeywords = ['feature', 'can i', 'is it possible', 'does it support', 'capabilities'];
    return featureKeywords.some(k => query.includes(k));
  }

  private isHowToQuery(query: string): boolean {
    const howToKeywords = ['how to', 'how do i', 'how can i', 'steps to', 'guide', 'manage'];
    return howToKeywords.some(k => query.includes(k));
  }

  private isNavigationQuery(query: string): boolean {
    const navKeywords = ['where', 'find', 'locate', 'navigate to', 'go to', 'access'];
    return navKeywords.some(k => query.includes(k));
  }

  private isComparisonQuery(query: string): boolean {
    return query.includes('difference') || query.includes('vs') || query.includes('compare');
  }

  private isWorkflowQuery(query: string): boolean {
    const workflowKeywords = ['process', 'workflow', 'flow', 'procedure', 'steps'];
    const specificWorkflows = ['recruitment', 'recruit', 'hiring', 'hire', 'payroll', 'salary processing', 'onboarding'];
    return workflowKeywords.some(k => query.includes(k)) ||
           specificWorkflows.some(k => query.includes(k));
  }

  // Response handlers
  private handleGreeting(): { content: string; suggestions: string[] } {
    return {
      content: `Hello! 👋 I'm your AI assistant for this HRMS system. I can help you understand modules, features, and guide you through various processes.\n\n**Here's what I can do:**\n• Explain any module or feature\n• Guide you through workflows\n• Help you find specific functionality\n• Answer questions about the system\n\nWhat would you like to know?`,
      suggestions: [
        'What modules are available?',
        'How do I manage employees?',
        'Explain the recruitment process',
        'Tell me about payroll'
      ]
    };
  }

  private handleModuleQuery(query: string, moduleContext?: string): { content: string; suggestions: string[]; relatedModules: IModuleInfo[] } {
    // Extract module mentions from query
    const mentionedModules = this.extractModules(query);

    if (mentionedModules.length === 0 && query.includes('what modules')) {
      // List all modules
      const coreModules = systemModules.filter(m =>
        ['Dashboard', 'User Management', 'Departments', 'Designations', 'Locations', 'Skills', 'Employee Management'].includes(m.name)
      );
      const recruitmentModules = systemModules.filter(m =>
        m.name.includes('Job') || m.name.includes('Candidate') || m.name.includes('Interview') || m.name.includes('Offer')
      );
      const hrModules = systemModules.filter(m =>
        m.name.includes('Attendance') || m.name.includes('Leave') || m.name.includes('Document')
      );
      const payrollModules = systemModules.filter(m =>
        m.name.includes('Salary') || m.name.includes('Payslip')
      );
      const performanceModules = systemModules.filter(m =>
        m.name.includes('Goal') || m.name.includes('Performance') || m.name.includes('Competenc') || m.name.includes('Learning')
      );

      let response = `# Available Modules\n\nThe HRMS system has **${systemModules.length} modules** organized into key areas:\n\n`;

      response += `## 📊 Core Modules (${coreModules.length})\n`;
      response += coreModules.map(m => `• **[${m.name}](${m.path})** - ${m.description}`).join('\n') + '\n\n';

      response += `## 🎯 Recruitment (${recruitmentModules.length} modules)\n`;
      response += recruitmentModules.map(m => `• **[${m.name}](${m.path})** - ${m.description}`).join('\n') + '\n\n';

      response += `## 📅 Time & Attendance (${hrModules.length} modules)\n`;
      response += hrModules.map(m => `• **[${m.name}](${m.path})** - ${m.description}`).join('\n') + '\n\n';

      response += `## 💰 Payroll (${payrollModules.length} modules)\n`;
      response += payrollModules.map(m => `• **[${m.name}](${m.path})** - ${m.description}`).join('\n') + '\n\n';

      response += `## 📈 Performance & Development (${performanceModules.length} modules)\n`;
      response += performanceModules.map(m => `• **[${m.name}](${m.path})** - ${m.description}`).join('\n') + '\n\n';

      response += `Click on any module name to navigate there, or ask me about specific modules!`;

      return {
        content: response,
        suggestions: [
          'Tell me about Employee Management',
          'How does recruitment work?',
          'Explain payroll processing',
          'What are performance reviews?'
        ],
        relatedModules: []
      };
    }

    // Provide detailed info about mentioned modules
    const module = mentionedModules[0];
    let response = `# ${module.name}\n\n${module.description}\n\n`;

    if (module.features && module.features.length > 0) {
      response += `## ✨ Key Features\n${module.features.map(f => `• ${f}`).join('\n')}\n\n`;
    }

    if (module.endpoints && module.endpoints.length > 0) {
      response += `## 🔗 API Endpoints\n${module.endpoints.map(e => `• \`${e}\``).join('\n')}\n\n`;
    }

    if (module.relatedModules && module.relatedModules.length > 0) {
      response += `## 🔄 Related Modules\n${module.relatedModules.join(', ')}\n\n`;
    }

    response += `**📍 Access:** Navigate to [${module.path}](${module.path})`;

    const relatedModules = getRelatedModules(module.name);

    return {
      content: response,
      suggestions: [
        `How do I use ${module.name}?`,
        ...relatedModules.slice(0, 2).map(m => `Tell me about ${m.name}`),
        'Show me related workflows'
      ],
      relatedModules
    };
  }

  private handleFeatureQuery(query: string): { content: string; suggestions: string[]; relatedModules: IModuleInfo[] } {
    const keywords = this.extractKeywords(query);
    const relevantModules = findModulesByKeyword(keywords[0] || query);

    if (relevantModules.length === 0) {
      return {
        content: `I couldn't find specific features matching "${keywords.join(', ')}". Could you rephrase your question or ask about a specific module?`,
        suggestions: [
          'What modules are available?',
          'Tell me about employee management',
          'List all features'
        ],
        relatedModules: []
      };
    }

    let response = `Here are the modules that support features related to **"${keywords.join(', ')}"**:\n\n`;

    relevantModules.forEach(module => {
      response += `### ${module.name}\n${module.description}\n`;
      if (module.features) {
        response += `**Features:** ${module.features.join(', ')}\n\n`;
      }
    });

    return {
      content: response,
      suggestions: relevantModules.slice(0, 3).map(m => `How do I use ${m.name}?`),
      relatedModules: relevantModules
    };
  }

  private handleHowToQuery(query: string): { content: string; suggestions: string[]; relatedModules?: IModuleInfo[] } {
    // Extract action from query
    if (query.includes('employee') || query.includes('manage employee')) {
      const relatedModules = [
        getModuleByPath('/employees'),
        getModuleByPath('/departments'),
        getModuleByPath('/designations'),
        getModuleByPath('/attendances')
      ].filter(Boolean) as IModuleInfo[];

      return {
        content: `# How to Manage Employees

## 📝 Adding a New Employee

1. Navigate to **[Employee Management](/employees)**
2. Click the "Add New Employee" button
3. Fill in required information:
   - Personal details (name, email, phone, address)
   - Employment information (employee ID, join date)
   - Department, designation, and location assignments
   - Skills and competencies
4. Upload required documents (resume, ID, certificates)
5. Save the employee record

## 🔄 Updating Employee Information

1. Go to **[Employee Management](/employees)**
2. Search for the employee using filters
3. Click on the employee record
4. Update necessary fields
5. Save changes

## 👥 Employee Onboarding Workflow

1. **Hire through recruitment** or **add directly**
2. Assign to **[Department](/departments)** and **[Designation](/designations)**
3. Set up **[Skills](/skills)** profile
4. Configure attendance tracking in **[Attendances](/attendances)**
5. Set up leave balance in **[Leave Applications](/leave-applications)**
6. Add to **[Salary Structure](/salary-structures)** for payroll
7. Set initial **[Goals](/goals)** and performance expectations

## 📊 Tracking & Management

• View all employees in one dashboard
• Filter by department, designation, location
• Track attendance and leave
• Monitor performance and goals
• Manage documents and certificates
• Generate employee reports`,
        suggestions: [
          'Explain the recruitment process',
          'How do I track attendance?',
          'Tell me about performance reviews'
        ],
        relatedModules
      };
    }

    if (query.includes('leave') || query.includes('time off')) {
      return {
        content: `# Leave Management Guide

## 👤 For Employees: Applying for Leave

1. Go to **[Leave Applications](/leave-applications)**
2. Click "Apply for Leave" button
3. Select leave type (sick, vacation, personal, etc.)
4. Choose start and end dates
5. Add reason/notes for the leave request
6. Check your available leave balance
7. Submit for approval

## 👔 For Managers: Approving Leave

1. Navigate to **[Leave Applications](/leave-applications)**
2. View pending leave requests
3. Review employee's:
   - Leave balance
   - Attendance history
   - Previous leave records
4. Approve or reject with comments
5. System updates leave balance automatically

## ⚙️ System Setup (HR/Admin)

### Configure Leave Types
• Go to **[Leave Types](/leave-types)**
• Create different leave categories (sick, vacation, personal, maternity, etc.)
• Set policies for each type:
  - Maximum days allowed
  - Accrual rules (how leave accumulates)
  - Carry-forward policies
  - Required approval levels

### Managing Leave Balances
• Set annual leave quotas per employee
• Configure accrual rates (monthly/yearly)
• Set up leave encashment rules
• Track leave history and patterns

## 📊 Leave Reports & Analytics
• View team leave calendar
• Track leave utilization
• Monitor attendance patterns
• Generate leave reports`,
        suggestions: [
          'What leave types are available?',
          'How does attendance tracking work?',
          'Tell me about payroll'
        ]
      };
    }

    if (query.includes('performance') || query.includes('review')) {
      return {
        content: `# Performance Review Process

## 🎯 Step 1: Setup (HR/Admin)

### Define Competencies
1. Go to **[Competencies](/competencies)**
2. Create competency framework (Leadership, Communication, Technical Skills, etc.)
3. Define behavioral indicators for each competency
4. Set proficiency levels (1-5 scale)

### Map to Roles
1. Navigate to **[Role Competencies](/role-competencies)**
2. Link required competencies to each job role
3. Define expected proficiency levels
4. Create role profiles

### Assess Employees
1. Visit **[Employee Competencies](/employee-competencies)**
2. Evaluate current competency levels
3. Identify skill gaps
4. Track certification and training

## 📈 Step 2: Goal Setting

1. Go to **[Goals](/goals)** at the start of review period
2. Set SMART goals for each employee:
   - Specific and measurable
   - Aligned with company objectives
   - Time-bound with deadlines
3. Assign goal owners and reviewers
4. Track progress throughout the period

## 📝 Step 3: Conduct Review

1. Navigate to **[Performance Reviews](/performance-reviews)**
2. Schedule review meetings
3. Collect feedback:
   - Self-assessment
   - Manager evaluation
   - Peer feedback (360-degree)
4. Rate against:
   - Competencies
   - Goals achievement
   - Key performance indicators
5. Provide constructive feedback
6. Identify strengths and areas for improvement

## 🎓 Step 4: Development Planning

1. Based on review results, create **[Learning Plans](/learning-plans)**
2. Assign training programs
3. Set skill development goals
4. Schedule follow-up reviews
5. Track progress and certification

## 📊 Benefits
• Data-driven performance insights
• Fair and transparent evaluation
• Clear career progression paths
• Continuous employee development`,
        suggestions: [
          'Tell me about competencies',
          'How do I set goals?',
          'Explain learning plans'
        ]
      };
    }

    return {
      content: `I can help you with various processes. Here are the main workflows:\n\n• **Employee Management** - Hiring, onboarding, profile management\n• **Recruitment** - Job postings, candidate tracking, interviews\n• **Attendance & Leave** - Time tracking, leave applications\n• **Payroll** - Salary structures, payslip generation\n• **Performance** - Goals, reviews, development plans\n\nWhat specific process would you like to know about?`,
      suggestions: [
        'How do I manage employees?',
        'How do I manage leave?',
        'How do I conduct performance reviews?'
      ]
    };
  }

  private handleNavigationQuery(query: string): { content: string; suggestions: string[] } {
    const keywords = this.extractKeywords(query);
    const relevantModules = findModulesByKeyword(keywords[0] || query);

    if (relevantModules.length > 0) {
      const module = relevantModules[0];
      return {
        content: `To access **${module.name}**, navigate to: [${module.path}](${module.path})\n\n${module.description}`,
        suggestions: [
          `Tell me more about ${module.name}`,
          'What features does it have?',
          'Show me related modules'
        ]
      };
    }

    return {
      content: `I can help you navigate to any module. Here are the main sections:\n\n**Core Modules:**\n• Dashboard - [/](/)\n• Employees - [/employees](/employees)\n• Departments - [/departments](/departments)\n\n**Recruitment:**\n• Job Openings - [/job-openings](/job-openings)\n• Candidates - [/candidates](/candidates)\n• Interviews - [/interviews](/interviews)\n\n**Time & Attendance:**\n• Attendance - [/attendances](/attendances)\n• Leave Applications - [/leave-applications](/leave-applications)\n\n**Payroll:**\n• Salary Structures - [/salary-structures](/salary-structures)\n• Payslips - [/payslips](/payslips)\n\nWhich module would you like to access?`,
      suggestions: [
        'Show me all modules',
        'Take me to employee management',
        'What modules are available?'
      ]
    };
  }

  private handleComparisonQuery(query: string): { content: string; suggestions: string[] } {
    if (query.includes('designation') && query.includes('job level')) {
      return {
        content: `## Designations vs Job Levels\n\n**Designations** ([/designations](/designations)):\n• Specific job titles (e.g., "Software Engineer", "HR Manager")\n• Define the role and responsibilities\n• Used for day-to-day identification\n• Can have multiple people with same designation\n\n**Job Levels** ([/job-levels](/job-levels)):\n• Career progression tiers (e.g., "Junior", "Senior", "Lead")\n• Define hierarchy and career paths\n• Linked to compensation bands\n• Used for promotions and salary structures\n\n**Relationship:** An employee has both - e.g., "Senior Software Engineer" where "Software Engineer" is the designation and "Senior" is the job level.`,
        suggestions: [
          'Tell me about salary structures',
          'How do I set up job levels?',
          'Explain career progression'
        ]
      };
    }

    if (query.includes('skill') && query.includes('competenc')) {
      return {
        content: `## Skills vs Competencies\n\n**Skills** ([/skills](/skills)):\n• Specific technical or functional abilities\n• Examples: "JavaScript", "Data Analysis", "Public Speaking"\n• Can be learned through training\n• Easily measurable and testable\n• Used in job requirements and candidate matching\n\n**Competencies** ([/competencies](/competencies)):\n• Broader behavioral characteristics\n• Examples: "Leadership", "Problem Solving", "Teamwork"\n• Combination of skills, knowledge, and attitudes\n• Assessed through observations and reviews\n• Used in performance evaluations\n\n**Relationship:** Competencies often encompass multiple skills. Employee development tracks both.`,
        suggestions: [
          'How do I assess competencies?',
          'Tell me about skill management',
          'Explain performance reviews'
        ]
      };
    }

    return {
      content: `I can help compare different modules or concepts. Here are some common comparisons:\n\n• Designations vs Job Levels\n• Skills vs Competencies\n• Goals vs Performance Reviews\n• Candidates vs Employees\n\nWhat would you like to compare?`,
      suggestions: [
        'Compare designations and job levels',
        'What\'s the difference between skills and competencies?',
        'Compare goals and performance reviews'
      ]
    };
  }

  private handleWorkflowQuery(query: string): { content: string; suggestions: string[]; relatedModules?: IModuleInfo[] } {
    if (query.includes('recruit') || query.includes('hiring') || query.includes('recruitment')) {
      const relatedModules = [
        getModuleByPath('/job-openings'),
        getModuleByPath('/candidates'),
        getModuleByPath('/interviews'),
        getModuleByPath('/offer-letters')
      ].filter(Boolean) as IModuleInfo[];

      return {
        content: `# Recruitment Workflow

The complete end-to-end hiring process:

## 📋 Step 1: Create Job Opening

1. Navigate to **[Job Openings](/job-openings)**
2. Click "Create New Job Opening"
3. Enter job details:
   - Job title and description
   - Department and location
   - Salary range
   - Required experience level
   - Responsibilities and requirements
4. Go to **[Job Opening Skills](/job-opening-skills)**
5. Add required and preferred skills
6. Set skill proficiency levels
7. Publish the job opening

## 👥 Step 2: Candidate Sourcing & Screening

1. Receive applications in **[Candidates](/candidates)**
2. Review resumes and profiles
3. Screen candidates based on:
   - Education and experience
   - Skills match (view in **[Candidate Skills](/candidate-skills)**)
   - Cultural fit
4. Shortlist candidates for interviews
5. Update candidate status (screening, shortlisted, rejected)

## 🎤 Step 3: Interview Process

1. Schedule interviews in **[Interviews](/interviews)**
2. Set up interview rounds:
   - Technical screening
   - HR interview
   - Manager interview
   - Final round
3. Assign interviewers
4. Set interview dates and times
5. Send invitations to candidates
6. Collect feedback and ratings from each interviewer
7. Make hiring decision based on:
   - Interview scores
   - Skills assessment
   - Cultural fit
   - Salary expectations

## 📄 Step 4: Offer & Onboarding

1. Generate offer letter in **[Offer Letters](/offer-letters)**
2. Include:
   - Compensation details
   - Benefits package
   - Start date
   - Terms and conditions
3. Send offer to selected candidate
4. Track offer status (sent, accepted, rejected, negotiating)
5. Once accepted:
   - Create employee record in **[Employees](/employees)**
   - Assign department and designation
   - Set up user access
   - Initiate onboarding process
6. Update job opening status to "filled"

## 📊 Throughout the Process

• Track all candidates in one place
• Monitor hiring pipeline metrics
• Collaborate with team on decisions
• Maintain candidate communication
• Generate recruitment reports

## 💡 Best Practices

• Define clear job requirements upfront
• Use structured interview questions
• Involve multiple stakeholders
• Provide timely feedback to candidates
• Document all decisions
• Track time-to-hire and cost-per-hire metrics`,
        suggestions: [
          'How do I create a job opening?',
          'Tell me about interview management',
          'How do I add employee after hiring?'
        ],
        relatedModules
      };
    }

    if (query.includes('payroll') || query.includes('salary') || query.includes('payslip')) {
      const relatedModules = [
        getModuleByPath('/salary-structures'),
        getModuleByPath('/attendances'),
        getModuleByPath('/leave-applications'),
        getModuleByPath('/payslips')
      ].filter(Boolean) as IModuleInfo[];

      return {
        content: `# Payroll Processing Workflow

Complete guide to processing employee payroll:

## ⚙️ Step 1: Initial Setup

### Create Salary Structures
1. Go to **[Salary Structures](/salary-structures)**
2. Create salary templates for different:
   - Job levels (Junior, Senior, Lead, Manager)
   - Departments
   - Roles and designations
3. Define salary components:
   - **Earnings:** Base salary, HRA, transport allowance, performance bonus
   - **Deductions:** Tax (TDS), provident fund, insurance, loans
   - **Benefits:** Medical insurance, meal vouchers, stock options
4. Set calculation formulas for each component
5. Define salary ranges and bands
6. Assign salary structures to employees

## 📅 Step 2: Track Attendance & Time

### Monitor Daily Attendance
1. Track in **[Attendances](/attendances)**
2. Record:
   - Check-in and check-out times
   - Work hours
   - Overtime hours
   - Late arrivals/early departures
   - Breaks
3. Set attendance policies:
   - Standard working hours
   - Overtime rates
   - Late/absence deductions

### Process Leave Applications
1. View approved leaves in **[Leave Applications](/leave-applications)**
2. Identify:
   - Paid leaves
   - Unpaid leaves
   - Half-day leaves
3. Calculate leave impact on salary:
   - Deduct for unpaid leaves
   - No deduction for paid leaves
4. Update leave balances

## 💰 Step 3: Calculate Payroll

### Run Payroll Calculation
1. Select payroll period (monthly, bi-weekly)
2. System automatically calculates:
   - **Gross Salary:** Base + allowances + bonuses
   - **Attendance Impact:** Overtime pay, absence deductions
   - **Leave Deductions:** Unpaid leave days
   - **Statutory Deductions:** Tax, provident fund, insurance
   - **Other Deductions:** Loans, advances, penalties
   - **Net Salary:** Gross - all deductions
3. Review calculations for accuracy
4. Handle special cases:
   - New joiners (pro-rated salary)
   - Resignations (final settlement)
   - Salary revisions
   - One-time bonuses or deductions

## 📄 Step 4: Generate Payslips

1. Navigate to **[Payslips](/payslips)**
2. Generate payslips for all employees
3. Payslip includes:
   - Employee details
   - Salary period
   - Attendance summary (days present, absent, leaves)
   - Earnings breakdown
   - Deductions breakdown
   - Net pay amount
   - Year-to-date totals
4. Review for errors before distribution

## 📤 Step 5: Distribution & Payment

1. Get manager/HR approval for payroll
2. Process bank transfers or payments
3. Distribute payslips to employees:
   - Email notifications
   - Download from portal
4. Maintain payment records:
   - Bank transaction IDs
   - Payment dates
   - Payment method
5. Archive for compliance and audits

## 📊 Reports & Compliance

### Generate Reports
• Monthly payroll register
• Tax deduction certificates
• Provident fund statements
• Salary revision reports
• Department-wise salary analysis
• Cost center allocation

### Compliance
• Maintain statutory records
• File tax returns
• Submit PF and ESI returns
• Generate Form 16 for employees
• Audit trail for all changes

## 💡 Best Practices

• Set up automated attendance integration
• Define clear salary policies
• Review payroll before processing
• Maintain backup of all records
• Communicate payroll schedule to employees
• Handle queries promptly
• Ensure data security and confidentiality

## 🔄 Monthly Payroll Cycle

1. **Day 1-25:** Track attendance daily
2. **Day 25:** Freeze attendance for the month
3. **Day 26-27:** Process leave applications
4. **Day 28:** Calculate payroll
5. **Day 29:** Review and get approvals
6. **Day 30/1:** Generate payslips
7. **Day 2-3:** Process payments
8. **Day 4-5:** Distribute payslips and handle queries`,
        suggestions: [
          'How do I set up salary structures?',
          'Tell me about attendance tracking',
          'How are leaves handled in payroll?'
        ],
        relatedModules
      };
    }

    return {
      content: `I can explain various workflows in the system:\n\n**Available Workflows:**\n• **Recruitment & Hiring** - Complete hiring process from job posting to onboarding\n• **Employee Onboarding** - Setting up new employees in the system\n• **Leave Management** - Leave application and approval process\n• **Payroll Processing** - Monthly salary calculation and distribution\n• **Performance Review Cycle** - Goal setting to review completion\n• **Learning & Development** - Training and skill development\n\nWhich workflow would you like to understand?`,
      suggestions: [
        'Explain the recruitment workflow',
        'Tell me about payroll',
        'How does performance review work?'
      ]
    };
  }

  private handleGeneralQuery(query: string): { content: string; suggestions: string[] } {
    // Try to find relevant modules based on keywords
    const keywords = this.extractKeywords(query);
    const relevantModules = keywords.length > 0 ? findModulesByKeyword(keywords[0]) : [];

    if (relevantModules.length > 0) {
      const moduleList = relevantModules
        .slice(0, 3)
        .map(m => `• **[${m.name}](${m.path})** - ${m.description}`)
        .join('\n');

      return {
        content: `Based on your query, these modules might be helpful:\n\n${moduleList}\n\nWould you like to know more about any of these?`,
        suggestions: relevantModules.slice(0, 3).map(m => `Tell me about ${m.name}`)
      };
    }

    return {
      content: `I'm here to help you navigate and understand the HRMS system. You can ask me about:\n\n• **Modules** - What each module does and its features\n• **Workflows** - How to complete specific processes\n• **Navigation** - Where to find specific functionality\n• **Features** - What capabilities are available\n\nTry asking something like:\n• "What modules are available?"\n• "How do I manage employees?"\n• "Explain the recruitment process"\n• "Tell me about payroll"`,
      suggestions: [
        'What modules are available?',
        'How do I manage employees?',
        'Explain the recruitment process',
        'Tell me about payroll'
      ]
    };
  }

  // Helper methods
  private extractModules(query: string): IModuleInfo[] {
    return systemModules.filter(module =>
      query.toLowerCase().includes(module.name.toLowerCase()) ||
      query.toLowerCase().includes(module.path.toLowerCase())
    );
  }

  private extractKeywords(query: string): string[] {
    const stopWords = ['what', 'where', 'how', 'can', 'does', 'is', 'the', 'a', 'an', 'to', 'do', 'i', 'me', 'about', 'tell', 'show', 'explain'];
    return query
      .toLowerCase()
      .split(' ')
      .filter(word => !stopWords.includes(word) && word.length > 2);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate contextual suggestions based on HYPER API category
  private generateHyperSuggestions(category: string): string[] {
    const suggestionMap: Record<string, string[]> = {
      employee: [
        'Show employees with missing documents',
        'Who hasn\'t completed onboarding?',
        'Show new hires this month',
        'Flag role mismatches'
      ],
      recruitment: [
        'Show recruitment pipeline',
        'Show interviews pending feedback',
        'Summarize hiring funnel',
        'Show overdue interviews'
      ],
      attendance: [
        'Give me today\'s attendance summary',
        'Show late comers',
        'Detect attendance anomalies',
        'Show absentee patterns'
      ],
      dashboard: [
        'Give me department-wise headcount',
        'Show open positions',
        'Who joined this week?',
        'Show leave overview'
      ],
      none: [
        'What modules are available?',
        'Show me the dashboard',
        'How do I manage employees?'
      ]
    };

    return suggestionMap[category] || suggestionMap.none;
  }

  // Get conversation history
  getHistory(): IMessage[] {
    return this.conversationHistory;
  }

  // Clear conversation
  clearHistory(): void {
    this.conversationHistory = [];
  }
}

// Singleton instance
export const chatService = new ChatService();
