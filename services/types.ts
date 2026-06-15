import { FeedbackData, MotivationAnalysisResult, UserFeedback } from '../types';

export class AnalysisServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalysisServiceError';
  }
}

export function isValidMotivationAnalysisResult(data: unknown): data is MotivationAnalysisResult {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, any>;
  return ['autonomy', 'competence', 'relatedness'].every(
    key => d[key] && typeof d[key].analysis === 'string' && typeof d[key].tip === 'string'
  );
}

export interface IAuthService {
  signInWithGoogle(): Promise<any>;
  signOutUser(): Promise<void>;
  onAuthStateChange(callback: (user: any) => void): () => void;
  signInWithEmail(email: string, password: string): Promise<any>;
  signUpWithEmail(email: string, password: string): Promise<any>;
  sendPasswordReset(email: string): Promise<void>;
}

interface QuestionResponse {
  id: number;
  text: string;
  score: number;
  category: string;
}

export interface IFeedbackRepo {
  saveFeedback(feedback: FeedbackData, userId?: string): Promise<void>;
  saveUserFeedback(feedback: Omit<UserFeedback, 'id' | 'read' | 'createdAt'>): Promise<void>;
  listFeedbacks(): Promise<UserFeedback[]>;
  updateFeedbackRead(feedbackId: string, read: boolean): Promise<void>;
}

export interface IAnalysisService {
  generateMotivationAnalysis(
    responses: QuestionResponse[],
    employeeName: string,
    managerName: string,
    lang: 'en' | 'he'
  ): Promise<MotivationAnalysisResult>;
}
