import { getFunctions, httpsCallable } from "firebase/functions";
import { AIInsights } from "../types";

// Get the Firebase Functions instance
const functions = getFunctions();

interface ComparisonDetail {
    text: string;
    section: string;
    scoreA: number;
    scoreB: number;
    delta: number;
}

interface GenerateInsightsRequest {
    founderAName: string;
    founderBName: string;
    allComparisonDetails: ComparisonDetail[];
    feedbackContext?: string;
    lang?: "en" | "he";
}

export const generateCompatibilityInsights = async (
    founderAName: string,
    founderBName: string,
    allComparisonDetails: Array<{ text: string; section: string; scoreA: number; scoreB: number; delta: number }>,
    feedbackContext: string,
    lang: 'en' | 'he' = 'en'
): Promise<AIInsights> => {
    try {
        const generateInsights = httpsCallable<GenerateInsightsRequest, AIInsights>(
            functions,
            "generateInsights"
        );

        const result = await generateInsights({
            founderAName,
            founderBName,
            allComparisonDetails,
            feedbackContext,
            lang
        });

        return result.data;
    } catch (error) {
        console.error("Cloud Function Error:", error);
        throw error;
    }
};
