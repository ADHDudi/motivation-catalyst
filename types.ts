export type Language = 'he' | 'en';
export type CategoryKey = 'autonomy' | 'competence' | 'relatedness';
export type UserRole = 'solo' | 'manager';

declare global {
  interface Window {
    firebase: any;
  }
}

export interface FeedbackData {
  rating: number; // 1 for thumbs down, 5 for thumbs up
  comment: string;
  timestamp: any; // Firestore timestamp
  results: Results;
  isRead?: boolean; // Ensure old code matches db update
}

export interface UserFeedback {
  id: string;
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  feedbackText: string;
  rating?: number;
  source: string;
  sessionId?: string | null;
  read: boolean;
  createdAt: any; // Firestore Timestamp
}

export interface LocalizedText {
  he: string;
  en: string;
}

export interface Question {
  id: number;
  category: CategoryKey;
  text: LocalizedText;
  weight: number;
}

export interface BrandColors {
  orange: string;
  green: string;
  pink: string;
  lightBlue: string;
  darkBlue: string;
  offWhite: string;
}

export interface CategoryColor {
  hex: string;
  bg: string;
  text: string;
  border: string;
}

export interface RatingColor {
  selected: string;
  unselected: string;
}

export interface TranslationData {
  dir: 'rtl' | 'ltr';
  title: string;
  subtitle: string;
  sdtIntro: string;
  painTitle: string;
  painText: string;
  solutionTitle: string;
  solutionText: string;
  valueTitle: string;
  valueList: string[];
  learnMore: string;
  learnMoreUrl: string;
  employeeName: string;
  employeeEmail: string;
  managerName: string;
  managerEmail: string;
  beginBtn: string;
  next: string;
  viewResults: string;
  profileTitle: string;
  outOf?: string;
  userInsights: string;
  aiInsightsTitle: string;
  feedbackTitle: string;
  feedbackThanks: string;
  feedbackComment: string;
  sendFeedback: string;
  managerRecs: string;
  copyReport: string;
  copyEmployee: string;
  copyManager: string;
  saveForMe: string;
  sendToManager: string;
  managerDetailsTitle: string;
  managerDetailsDesc: string;
  prepareEmail: string;
  emailPrepSuccess?: string;
  newAssessment: string;
  startOver: string;
  copied: string;
  copiedSection: string;
  agree: string;
  disagree: string;
  testMode: string;
  testHigh: string;
  testMid: string;
  testAtRisk: string; // "testLow" in English, "testAtRisk" in logic
  questionProgress: string;
  genConversation: string;
  conversationTitle: string;
  conversationIntro: string;
  followMe: string;
  categoryIntroBtn: string;
  categoryIntroLabel: string;
  categoryIntroDesc: Record<CategoryKey, string>;
  // Phase 1: rating labels (mobile pills)
  rating1Label: string;
  rating2Label: string;
  rating3Label: string;
  rating4Label: string;
  rating5Label: string;
  // Phase 1: role selector
  roleSelectGreeting: string;
  roleSelectIntro: string;
  roleSolo: string;
  roleSoloDesc: string;
  roleManager: string;
  roleManagerDesc: string;
  roleSelectCta: string;
  roleSelectContinueAs: string;
  // Phase 1: resume banner
  resumeBannerTitle: string;
  resumeBannerText: string;
  resumeContinue: string;
  resumeStartFresh: string;
  // Phase 1: what's next strip
  whatsNextTitle: string;
  whatsNextCopyTitle: string;
  whatsNextCopyDesc: string;
  whatsNextShareTitle: string;
  whatsNextShareDesc: string;
  whatsNextRetakeTitle: string;
  whatsNextRetakeDesc: string;
  whatsNextRetakeSubject: string;
  whatsNextRetakeBody: string;
  // Phase 1: role labels on analysis screen
  roleSoloLabel: string;
  roleManagerLabel: string;
  // Phase 1: share
  shareIntroLine: string;
  categories: Record<CategoryKey, string>;
  deepAnalysis: Record<CategoryKey, DeepAnalysisCategory>;
  conversationTips: {
    employee: Record<CategoryKey | 'high', string>;
    manager: Record<CategoryKey | 'high', string>;
  };
}

export interface DeepAnalysisCategory {
  title: string;
  employee: {
    low: AnalysisDetail;
    high: AnalysisDetail;
  };
  manager: {
    low: AnalysisDetail;
    high: AnalysisDetail;
  };
}

export interface AnalysisDetail {
  analysis: string;
  actions: string[];
  aiTips?: string;
}

export interface FormData {
  employeeName: string;
  employeeEmail: string;
  managerName: string;
  managerEmail: string;
}

export type Answers = Record<number, number>;

export type Results = Record<CategoryKey, number>;

export interface MotivationAnalysisResult {
  autonomy: { analysis: string; tip: string; adhd_tip?: string };
  competence: { analysis: string; tip: string; adhd_tip?: string };
  relatedness: { analysis: string; tip: string; adhd_tip?: string };
}