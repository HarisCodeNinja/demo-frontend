export interface IMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  moduleContext?: string;
  suggestions?: string[];
}

export interface IChatSession {
  id: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IModuleInfo {
  name: string;
  path: string;
  description: string;
  endpoints?: string[];
  features?: string[];
  relatedModules?: string[];
}

export interface IChatRequest {
  message: string;
  sessionId?: string;
  moduleContext?: string;
}

export interface IChatResponse {
  message: IMessage;
  suggestions?: string[];
  relatedModules?: IModuleInfo[];
}

export interface IModuleContext {
  modules: IModuleInfo[];
  currentModule?: string;
}
