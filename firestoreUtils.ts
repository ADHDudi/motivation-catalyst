
import { FeedbackData } from './types';

// Helper to save feedback to Firestore
// Note: We access window.firebase because we are using the CDN scripts from index.html
export const saveFeedback = async (feedback: FeedbackData): Promise<void> => {
    if (!window.firebase) {
        console.error('Firebase not initialized');
        return;
    }

    try {
        const db = window.firebase.firestore();
        await db.collection('feedback').add({
            ...feedback,
            timestamp: window.firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent
        });
        console.log('Feedback saved successfully');
    } catch (error) {
        console.error('Error saving feedback:', error);
        throw error;
    }
};
