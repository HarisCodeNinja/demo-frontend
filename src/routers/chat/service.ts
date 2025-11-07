import { IMessage, IChatRequest, IChatResponse, IModuleInfo } from './interface';
import { systemModules, findModulesByKeyword, getModuleByPath, getRelatedModules } from './moduleContext';

// MCP-like intelligent response generator
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

    // Intent detection
    if (this.isGreeting(lowerQuery)) {
      return this.handleGreeting();
    }

    if (this.isModuleQuery(lowerQuery)) {
      return this.handleModuleQuery(lowerQuery, moduleContext);
    }

    if (this.isFeatureQuery(lowerQuery)) {
      return this.handleFeatureQuery(lowerQuery);
    }

    if (this.isHowToQuery(lowerQuery)) {
      return this.handleHowToQuery(lowerQuery);
    }

    if (this.isNavigationQuery(lowerQuery)) {
      return this.handleNavigationQuery(lowerQuery);
    }

    if (this.isComparisonQuery(lowerQuery)) {
      return this.handleComparisonQuery(lowerQuery);
    }

    if (this.isWorkflowQuery(lowerQuery)) {
      return this.handleWorkflowQuery(lowerQuery);
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
    const howToKeywords = ['how to', 'how do i', 'how can i', 'steps to', 'guide'];
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
    return workflowKeywords.some(k => query.includes(k));
  }

  // Response handlers
  private handleGreeting(): { content: string; suggestions: string[] } {
    return {
      content: `Hello! I'm your AI assistant for this HRMS system. I can help you understand modules, features, and guide you through various processes.\n\nHere's what I can do:\n- Explain any module or feature\n- Guide you through workflows\n- Help you find specific functionality\n- Answer questions about the system\n\nWhat would you like to know?`,
      suggestions: [
        'What modules are available?',
        'How do I manage employees?',
        'Tell me about the recruitment process',
        'What can I do with attendance tracking?'
      ]
    };
  }

  private handleModuleQuery(query: string, moduleContext?: string): { content: string; suggestions: string[]; relatedModules: IModuleInfo[] } {
    // Extract module mentions from query
    const mentionedModules = this.extractModules(query);

    if (mentionedModules.length === 0) {
      // List all modules
      const moduleList = systemModules.map(m => `• **${m.name}** - ${m.description}`).join('\n');
      return {
        content: `Here are all the available modules in the system:\n\n${moduleList}\n\nWould you like to know more about any specific module?`,
        suggestions: [
          'Tell me about Employee Management',
          'What is the recruitment process?',
          'How does attendance tracking work?',
          'Explain the performance review module'
        ],
        relatedModules: []
      };
    }

    // Provide detailed info about mentioned modules
    const module = mentionedModules[0];
    let response = `## ${module.name}\n\n${module.description}\n\n`;

    if (module.features && module.features.length > 0) {
      response += `**Key Features:**\n${module.features.map(f => `• ${f}`).join('\n')}\n\n`;
    }

    if (module.endpoints && module.endpoints.length > 0) {
      response += `**Available Endpoints:**\n${module.endpoints.map(e => `• \`${e}\``).join('\n')}\n\n`;
    }

    if (module.relatedModules && module.relatedModules.length > 0) {
      response += `**Related Modules:** ${module.relatedModules.join(', ')}\n\n`;
    }

    response += `**Access:** Navigate to [${module.path}](${module.path})`;

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

    let response = `Here are the modules that support features related to "${keywords.join(', ')}":\n\n`;

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

  private handleHowToQuery(query: string): { content: string; suggestions: string[] } {
    // Extract action from query
    if (query.includes('employee') || query.includes('hire')) {
      return {
        content: `## How to Manage Employees\n\n**Adding a New Employee:**\n1. Navigate to **Employee Management** (/employees)\n2. Click "Add New Employee" button\n3. Fill in personal information (name, email, phone)\n4. Assign department, designation, and location\n5. Set employment details (join date, employee ID)\n6. Add skills and competencies\n7. Upload required documents\n8. Save the employee record\n\n**For Recruitment:**\n1. Create a **Job Opening** (/job-openings)\n2. Define required skills (/job-opening-skills)\n3. Review **Candidates** (/candidates) who apply\n4. Schedule **Interviews** (/interviews)\n5. Generate **Offer Letter** (/offer-letters) for selected candidate\n6. Convert to **Employee** once accepted`,
        suggestions: [
          'Tell me about the recruitment process',
          'How do I track attendance?',
          'Explain leave management'
        ]
      };
    }

    if (query.includes('leave') || query.includes('time off')) {
      return {
        content: `## How to Manage Leave\n\n**For Employees:**\n1. Go to **Leave Applications** (/leave-applications)\n2. Click "Apply for Leave"\n3. Select leave type (sick, vacation, personal)\n4. Choose start and end dates\n5. Add reason/notes\n6. Submit for approval\n\n**For Managers:**\n1. View pending applications in **Leave Applications**\n2. Review employee's leave balance\n3. Check attendance history\n4. Approve or reject with comments\n\n**Setup:**\n- Configure leave types in **Leave Types** (/leave-types)\n- Set policies, accrual rules, and balances`,
        suggestions: [
          'What leave types are available?',
          'How does attendance tracking work?',
          'Tell me about the approval workflow'
        ]
      };
    }

    if (query.includes('performance') || query.includes('review')) {
      return {
        content: `## How to Conduct Performance Reviews\n\n**Setup:**\n1. Define **Competencies** (/competencies) for roles\n2. Map competencies to roles in **Role Competencies** (/role-competencies)\n3. Assess employee competencies in **Employee Competencies** (/employee-competencies)\n\n**Review Process:**\n1. Set employee **Goals** (/goals) at the start of period\n2. Track progress throughout the period\n3. Schedule review in **Performance Reviews** (/performance-reviews)\n4. Collect feedback from managers and peers\n5. Rate against competencies and goals\n6. Create development plan\n7. Assign **Learning Plans** (/learning-plans) for improvement`,
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
        'How do I hire an employee?',
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
      content: `I can help you navigate to any module. Here are the main sections:\n\n**Core Modules:**\n• Dashboard - /\n• Employees - /employees\n• Departments - /departments\n\n**Recruitment:**\n• Job Openings - /job-openings\n• Candidates - /candidates\n• Interviews - /interviews\n\n**Time & Attendance:**\n• Attendance - /attendances\n• Leave Applications - /leave-applications\n\n**Payroll:**\n• Salary Structures - /salary-structures\n• Payslips - /payslips\n\nWhich module would you like to access?`,
      suggestions: [
        'Show me all modules',
        'Take me to employee management',
        'Where is the dashboard?'
      ]
    };
  }

  private handleComparisonQuery(query: string): { content: string; suggestions: string[] } {
    if (query.includes('designation') && query.includes('job level')) {
      return {
        content: `## Designations vs Job Levels\n\n**Designations** (/designations):\n• Specific job titles (e.g., "Software Engineer", "HR Manager")\n• Define the role and responsibilities\n• Used for day-to-day identification\n• Can have multiple people with same designation\n\n**Job Levels** (/job-levels):\n• Career progression tiers (e.g., "Junior", "Senior", "Lead")\n• Define hierarchy and career paths\n• Linked to compensation bands\n• Used for promotions and salary structures\n\n**Relationship:** An employee has both - e.g., "Senior Software Engineer" where "Software Engineer" is the designation and "Senior" is the job level.`,
        suggestions: [
          'Tell me about salary structures',
          'How do I set up job levels?',
          'Explain career progression'
        ]
      };
    }

    if (query.includes('skill') && query.includes('competenc')) {
      return {
        content: `## Skills vs Competencies\n\n**Skills** (/skills):\n• Specific technical or functional abilities\n• Examples: "JavaScript", "Data Analysis", "Public Speaking"\n• Can be learned through training\n• Easily measurable and testable\n• Used in job requirements and candidate matching\n\n**Competencies** (/competencies):\n• Broader behavioral characteristics\n• Examples: "Leadership", "Problem Solving", "Teamwork"\n• Combination of skills, knowledge, and attitudes\n• Assessed through observations and reviews\n• Used in performance evaluations\n\n**Relationship:** Competencies often encompass multiple skills. Employee development tracks both.`,
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

  private handleWorkflowQuery(query: string): { content: string; suggestions: string[] } {
    if (query.includes('recruit') || query.includes('hiring')) {
      return {
        content: `## Recruitment Workflow\n\n**Step 1: Job Opening**\n• Create job posting in **Job Openings** (/job-openings)\n• Define requirements, responsibilities, and salary range\n• Add required skills in **Job Opening Skills** (/job-opening-skills)\n\n**Step 2: Candidate Sourcing**\n• Receive applications in **Candidates** (/candidates)\n• Screen resumes and qualifications\n• Assess candidate skills in **Candidate Skills** (/candidate-skills)\n\n**Step 3: Interview Process**\n• Schedule interviews in **Interviews** (/interviews)\n• Assign interviewers and set time slots\n• Collect feedback and ratings\n• Make hiring decision\n\n**Step 4: Offer & Onboarding**\n• Generate offer letter in **Offer Letters** (/offer-letters)\n• Get candidate acceptance\n• Create employee record in **Employees** (/employees)\n• Assign department, designation, and setup access`,
        suggestions: [
          'How do I create a job opening?',
          'Tell me about interview management',
          'How do I convert candidate to employee?'
        ]
      };
    }

    if (query.includes('payroll') || query.includes('salary')) {
      return {
        content: `## Payroll Processing Workflow\n\n**Step 1: Setup**\n• Define salary components in **Salary Structures** (/salary-structures)\n• Create templates for different roles/levels\n• Set up deductions and benefits\n\n**Step 2: Track Attendance**\n• Monitor daily attendance in **Attendances** (/attendances)\n• Track work hours and overtime\n• Process leave applications\n\n**Step 3: Generate Payslips**\n• Calculate salaries based on attendance\n• Apply salary structure components\n• Add bonuses or deductions\n• Generate **Payslips** (/payslips)\n\n**Step 4: Distribution**\n• Review and approve payroll\n• Distribute payslips to employees\n• Process payments\n• Maintain payment history`,
        suggestions: [
          'How do I set up salary structures?',
          'Tell me about attendance tracking',
          'How are leaves handled in payroll?'
        ]
      };
    }

    return {
      content: `I can explain various workflows in the system:\n\n**Available Workflows:**\n• Recruitment & Hiring\n• Employee Onboarding\n• Leave Management\n• Payroll Processing\n• Performance Review Cycle\n• Learning & Development\n\nWhich workflow would you like to understand?`,
      suggestions: [
        'Explain the recruitment workflow',
        'How does payroll processing work?',
        'Tell me about the performance review process'
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
        .map(m => `• **${m.name}** (/${m.path}) - ${m.description}`)
        .join('\n');

      return {
        content: `Based on your query, these modules might be helpful:\n\n${moduleList}\n\nWould you like to know more about any of these?`,
        suggestions: relevantModules.slice(0, 3).map(m => `Tell me about ${m.name}`)
      };
    }

    return {
      content: `I'm here to help you navigate and understand the HRMS system. You can ask me about:\n\n• **Modules** - What each module does and its features\n• **Workflows** - How to complete specific processes\n• **Navigation** - Where to find specific functionality\n• **Features** - What capabilities are available\n\nTry asking something like "Tell me about employee management" or "How do I process payroll?"`,
      suggestions: [
        'What modules are available?',
        'How do I manage employees?',
        'Explain the recruitment process',
        'Show me payroll features'
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
