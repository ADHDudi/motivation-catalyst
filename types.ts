export type Language = 'he' | 'en';
export type CategoryKey = 'autonomy' | 'competence' | 'relatedness';

declare global {
  interface Window {
    firebase: any;
  }
}

export interface FeedbackData {
  rating: number; // 1 for thumbs down, 5 for thumbs up (or boolean, but user asked for "option to use this feedback")
  comment: string;
  timestamp: any; // Firestore timestamp
  results: Results;
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

export type Results = Record<CategoryKey, string>;

export interface MotivationAnalysisResult {
  autonomy: { analysis: string; tip: string };
  competence: { analysis: string; tip: string };
  relatedness: { analysis: string; tip: string };
}