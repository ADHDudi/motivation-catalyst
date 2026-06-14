import { IAuthService, IFeedbackRepo, IAnalysisService } from './types';
import { signInWithGoogle, signOutUser, onAuthStateChange, signInWithEmail, signUpWithEmail, sendPasswordReset } from '../authUtils';
import { saveFeedback, saveUserFeedback, listFeedbacks, updateFeedbackRead } from '../firestoreUtils';
import { generateMotivationAnalysis } from './geminiService';
import { FeedbackData, UserFeedback } from '../types';

export const firebaseAuthService: IAuthService = {
  signInWithGoogle,
  signOutUser,
  onAuthStateChange,
  signInWithEmail,
  signUpWithEmail,
  sendPasswordReset,
};

export const firebaseFeedbackRepo: IFeedbackRepo = {
  saveFeedback: (feedback: FeedbackData) => saveFeedback(feedback),
  saveUserFeedback: (feedback: Omit<UserFeedback, 'id' | 'read' | 'createdAt'>) => saveUserFeedback(feedback),
  listFeedbacks,
  updateFeedbackRead,
};

export const firebaseAnalysisService: IAnalysisService = {
  generateMotivationAnalysis,
};
