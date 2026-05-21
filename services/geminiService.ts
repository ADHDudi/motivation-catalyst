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
    const url = 'https://us-central1-motivation-catalyst-david.cloudfunctions.net/generateMotivationAnalysis';
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { responses, employeeName, managerName, lang } }),
    });
    if (!res.ok) throw new Error(`Cloud Function error: ${res.status}`);
    const json = await res.json();
    return json.result as MotivationAnalysisResult;
};
