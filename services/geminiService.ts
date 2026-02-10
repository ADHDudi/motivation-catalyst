// import { AIInsights } from "../types"; // Removed as it is not exported

// Access the global firebase instance
const getFunctions = () => {
    if (!window.firebase) {
        throw new Error("Firebase SDK not initialized");
    }
    return window.firebase.functions();
};

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
): Promise<any> => {
    try {
        const functions = getFunctions();
        const generateInsights = functions.httpsCallable("generateInsights");

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

interface QuestionResponse {
    id: number;
    text: string;
    score: number;
    category: string;
}

interface GenerateMotivationAnalysisRequest {
    responses: QuestionResponse[];
    employeeName: string;
    managerName?: string;
    lang?: "en" | "he";
}

import { MotivationAnalysisResult } from "../types";

export const generateMotivationAnalysis = async (
    responses: QuestionResponse[],
    employeeName: string,
    managerName: string,
    lang: 'en' | 'he' = 'en'
): Promise<MotivationAnalysisResult> => {
    try {
        const functions = getFunctions();
        const generateAnalysis = functions.httpsCallable("generateMotivationAnalysis");

        const result = await generateAnalysis({
            responses,
            employeeName,
            managerName,
            lang
        });

        return result.data as MotivationAnalysisResult;
    } catch (error) {
        console.warn("Cloud Function Error (Motivation):", error);
        throw error;
    }
};
