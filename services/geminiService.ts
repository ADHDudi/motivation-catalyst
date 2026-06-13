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

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const generateMotivationAnalysis = async (
    responses: QuestionResponse[],
    employeeName: string,
    managerName: string,
    lang: 'en' | 'he' = 'en'
): Promise<MotivationAnalysisResult> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('VITE_GEMINI_API_KEY not set');

    const langLabel = lang === 'he' ? 'HEBREW' : 'ENGLISH';
    const prompt = `You are an expert Organizational Psychologist specializing in Self-Determination Theory (SDT).

Analyze the motivation profile of ${employeeName} based on their SDT assessment answers.
${managerName ? `Their manager is ${managerName}.` : ''}

Assessment data:
${responses.map(r => `- [${r.category.toUpperCase()}] "${r.text}": ${r.score}/5`).join('\n')}

For each SDT category (autonomy, competence, relatedness) provide:
- analysis: a concise, direct insight about their motivational state in this dimension
- tip: a specific, actionable recommendation they can apply this week
- adhd_tip: a dopamine-friendly, micro-step version of the tip designed for ADHD (visual cues, gamification, breaking tasks into tiny wins)

IMPORTANT: Respond entirely in ${langLabel}. Return strictly valid JSON matching this schema:
{
  "autonomy":    { "analysis": "...", "tip": "...", "adhd_tip": "..." },
  "competence":  { "analysis": "...", "tip": "...", "adhd_tip": "..." },
  "relatedness": { "analysis": "...", "tip": "...", "adhd_tip": "..." }
}`;

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
        }),
    });

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');
    return JSON.parse(text) as MotivationAnalysisResult;
};
