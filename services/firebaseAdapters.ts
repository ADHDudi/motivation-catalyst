import { IAuthService, IFeedbackRepo, IAnalysisService, AnalysisServiceError, isValidMotivationAnalysisResult } from './types';
import { signInWithGoogle, signOutUser, onAuthStateChange, signInWithEmail, signUpWithEmail, sendPasswordReset } from '../authUtils';
import { saveUserFeedback } from '../firestoreUtils';
import { FeedbackData, UserFeedback } from '../types';

const isReady = () => (window.firebase?.apps?.length ?? 0) > 0;

export const firebaseAuthService: IAuthService = {
  signInWithGoogle,
  signOutUser,
  onAuthStateChange,
  signInWithEmail,
  signUpWithEmail,
  sendPasswordReset,
};

export const firebaseFeedbackRepo: IFeedbackRepo = {
  saveFeedback: async (feedback: FeedbackData, userId?: string) => {
    if (!isReady()) return;
    try {
      const db = window.firebase.firestore();
      const uid = userId ?? window.firebase.auth().currentUser?.uid ?? null;
      await db.collection('feedback').add({
        ...feedback,
        userId: uid,
        timestamp: window.firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent,
        isRead: false,
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }
  },

  saveUserFeedback: (feedback: Omit<UserFeedback, 'id' | 'read' | 'createdAt'>) => saveUserFeedback(feedback),

  listFeedbacks: async () => {
    if (!isReady()) return [];
    try {
      const db = window.firebase.firestore();
      const snapshot = await db.collection('feedback').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as UserFeedback[];
    } catch (error) {
      console.error('Error listing feedbacks:', error);
      throw error;
    }
  },

  updateFeedbackRead: async (feedbackId: string, read: boolean) => {
    if (!isReady()) return;
    try {
      const db = window.firebase.firestore();
      await db.collection('feedback').doc(feedbackId).update({ read });
    } catch (error) {
      console.error('Error updating feedback read status:', error);
      throw error;
    }
  },
};

export const firebaseAnalysisService: IAnalysisService = {
  generateMotivationAnalysis: async (responses, employeeName, managerName, lang) => {
    if (!isReady()) throw new Error('Firebase SDK not initialized');
    const functions = window.firebase.functions();
    const fn = functions.httpsCallable('generateMotivationAnalysis');
    const result = await fn({ responses, employeeName, managerName, lang });
    if (!isValidMotivationAnalysisResult(result.data)) {
      throw new AnalysisServiceError(
        `Invalid MotivationAnalysisResult shape: ${JSON.stringify(result.data)}`
      );
    }
    return result.data;
  },
};
