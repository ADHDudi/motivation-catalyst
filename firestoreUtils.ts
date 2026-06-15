
import { FeedbackData, UserFeedback } from './types';

// Helper to save feedback to Firestore
// Note: We access window.firebase because we are using the CDN scripts from index.html
export const saveFeedback = async (feedback: FeedbackData): Promise<void> => {
    if (!window.firebase) {
        console.error('Firebase not initialized');
        return;
    }

    try {
        const db = window.firebase.firestore();
        const user = window.firebase.auth().currentUser;
        await db.collection('feedback').add({
            ...feedback,
            userId: user ? user.uid : null,
            userEmail: user ? user.email : null,
            timestamp: window.firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent,
            isRead: false
        });
        console.log('Feedback saved successfully');
    } catch (error) {
        console.error('Error saving feedback:', error);
        throw error;
    }
};

export const saveUserFeedback = async (feedback: Omit<UserFeedback, 'id' | 'read' | 'createdAt'>): Promise<void> => {
    if (!window.firebase) {
        console.error('Firebase not initialized');
        return;
    }
    try {
        const db = window.firebase.firestore();
        await db.collection('feedback').add({
            ...feedback,
            read: false,
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error saving user feedback:', error);
        throw error;
    }
};

export const listFeedbacks = async (): Promise<UserFeedback[]> => {
    if (!window.firebase) return [];
    try {
        const db = window.firebase.firestore();
        const snapshot = await db.collection('feedback').orderBy('createdAt', 'desc').get();
        return snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        })) as UserFeedback[];
    } catch (error) {
        console.error('Error listing feedbacks:', error);
        throw error;
    }
};

export const updateFeedbackRead = async (feedbackId: string, read: boolean): Promise<void> => {
    if (!window.firebase) return;
    try {
        const db = window.firebase.firestore();
        await db.collection('feedback').doc(feedbackId).update({ read });
    } catch (error) {
        console.error('Error updating feedback read status:', error);
        throw error;
    }
};
