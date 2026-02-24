import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GoogleGenAI, Type, Schema } from "@google/genai";

// Initialize Gemini with the API key from environment
const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    return new GoogleGenAI({ apiKey });
};

// Define the response schema
const insightSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        compatibility_score: {
            type: Type.INTEGER,
            description: "A score from 0 to 100 representing the compatibility percentage.",
        },
        friction_points: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Short, punchy title (3-5 words)." },
                    description: { type: Type.STRING, description: "Detailed explanation of the issue." },
                    tip: { type: Type.STRING, description: "Actionable advice on how to OVERCOME or MANAGE this conflict." }
                },
                required: ["title", "description", "tip"]
            },
            description: "Exactly 3 specific areas where conflict is highly likely.",
        },
        synergies: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Short, punchy title (3-5 words)." },
                    description: { type: Type.STRING, description: "Detailed explanation of the strength." },
                    tip: { type: Type.STRING, description: "Advice on how to LEVERAGE and MAINTAIN this strength." }
                },
                required: ["title", "description", "tip"]
            },
            description: "Exactly 3 areas where they align well.",
        },
        verdict: {
            type: Type.STRING,
            description: "A one-sentence recommendation on how to overcome gaps or maintain synergies.",
        },
    },
    required: ["compatibility_score", "friction_points", "synergies", "verdict"],
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

export const generateInsights = onCall(
    async (request: CallableRequest<GenerateInsightsRequest>) => {
        const { founderAName, founderBName, allComparisonDetails, feedbackContext, lang = "en" } = request.data;

        // Validate required fields
        if (!founderAName || !founderBName || !allComparisonDetails) {
            throw new HttpsError(
                "invalid-argument",
                "Missing required fields: founderAName, founderBName, allComparisonDetails"
            );
        }

        try {
            const ai = getAI();

            const prompt = `
      You are an expert Organizational Psychologist specializing in startup co-founder dynamics.
      
      **Objective:** Analyze the compatibility of two co-founders (${founderAName} and ${founderBName}) based on their answers to a questionnaire.
      
      **Data:**
      ${allComparisonDetails.map((d: ComparisonDetail) =>
                `- [${d.section}] "${d.text}" -> ${founderAName}: ${d.scoreA}, ${founderBName}: ${d.scoreB} (Delta: ${d.delta})`
            ).join("\n")}

      **Instructions:**
      1. **Analyze Inputs:** Compare the answers provided by ${founderAName} and ${founderBName}.
      2. **Identify Gaps:** Look specifically for divergences (High Deltas) in:
         * Thinking & Decision Style
         * Risk, Ownership & Ambition
         * Communication & Collaboration
         * Work Ethic (implied in sections)
      3. **Identify Synergies:** Look for areas where they strongly agree or have similar scores.
      4. **Calculate Score:** Assign a "Compatibility Score" from 0-100% based on the severity of the gaps vs the strength of the synergies.
         - 0% = Total Mismatch
         - 100% = Perfect Match
      
      **Language Requirement:**
      ***IMPORTANT: Respond entirely in ${lang === "he" ? "HEBREW" : "ENGLISH"}.***

      **Constraint:** Be direct and objective. Do not sugarcoat potential conflicts.

      ${feedbackContext ? `\nContext from previous user feedback: ${feedbackContext}` : ""}
    `;

            const response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: insightSchema,
                    systemInstruction: `You are an expert Organizational Psychologist. Return strictly valid JSON matching the schema. Write all content in ${lang === "he" ? "Hebrew" : "English"}.`,
                },
            });

            const text = response.text;
            if (!text) {
                throw new HttpsError("internal", "No response from AI");
            }

            return JSON.parse(text);
        } catch (error) {
            logger.error("Gemini API Error:", error);
            throw new HttpsError(
                "internal",
                `Failed to generate insights: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }
);

// --- Motivation Catalyst Analysis ---

const motivationSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        autonomy: {
            type: Type.OBJECT,
            properties: {
                analysis: { type: Type.STRING, description: "Analysis of the user's need for autonomy based on their specific answers." },
                tip: { type: Type.STRING, description: "A specific, actionable tip to improve or maintain autonomy." },
                adhd_tip: { type: Type.STRING, description: "An ADHD-friendly version of the tip, focusing on executive function support, clear steps, and overcoming distraction/procrastination." }
            },
            required: ["analysis", "tip", "adhd_tip"]
        },
        competence: {
            type: Type.OBJECT,
            properties: {
                analysis: { type: Type.STRING, description: "Analysis of the user's need for competence." },
                tip: { type: Type.STRING, description: "A specific, actionable tip to improve or maintain competence." },
                adhd_tip: { type: Type.STRING, description: "An ADHD-friendly version of the tip, focusing on executive function support, clear steps, and overcoming distraction/procrastination." }
            },
            required: ["analysis", "tip", "adhd_tip"]
        },
        relatedness: {
            type: Type.OBJECT,
            properties: {
                analysis: { type: Type.STRING, description: "Analysis of the user's need for relatedness." },
                tip: { type: Type.STRING, description: "A specific, actionable tip to improve or maintain relatedness." },
                adhd_tip: { type: Type.STRING, description: "An ADHD-friendly version of the tip, focusing on executive function support, clear steps, and overcoming distraction/procrastination." }
            },
            required: ["analysis", "tip", "adhd_tip"]
        }
    },
    required: ["autonomy", "competence", "relatedness"]
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

export const generateMotivationAnalysis = onCall(
    async (request: CallableRequest<GenerateMotivationAnalysisRequest>) => {
        const { responses, employeeName, managerName, lang = "en" } = request.data;

        if (!responses || !Array.isArray(responses) || responses.length === 0) {
            throw new HttpsError(
                "invalid-argument",
                "Missing required field: responses"
            );
        }

        try {
            const ai = getAI();

            const prompt = `
                You are an expert Organizational Psychologist specializing in Self-Determination Theory (SDT).
                
                **Objective:** Analyze the motivation profile of ${employeeName} based on their specific answers to the SDT assessment.
                
                **Data:**
                ${responses.map(r => `- [${r.category.toUpperCase()}] "${r.text}": ${r.score}/5`).join("\n")}
                
                **Manager Context:** ${managerName ? `The user's manager is named ${managerName}.` : "No manager specified."}

                **Instructions:**
                1. **Analyze:** specific answers to understand the nuance of their motivation. Don't just look at the average.
                2. **Identify Patterns:** Are they high in competence but low in autonomy? Do they feel isolated (relatedness)?
                3. **Generate Insights:** For EACH category (Autonomy, Competence, Relatedness), provide:
                   - **Analysis:** A brief, direct insight about their state.
                   - **Tip:** A highly specific, actionable recommendation to improve their situation.
                   - **ADHD Tip:** A specialized version of the tip designed for someone with ADHD. Focus on:
                       - Breaking tasks into micro-steps.
                       - Using visual cues or gamification.
                       - Addressing executive dysfunction (initiation, sustained attention).
                       - Being "dopamine-friendly" (reward-based).
                
                **Language Requirement:**
                ***IMPORTANT: Respond entirely in ${lang === "he" ? "HEBREW" : "ENGLISH"}.***

                **Tone:** Professional, empathetic, yet action-oriented.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: motivationSchema,
                    systemInstruction: `You are an expert Organizational Psychologist. Return strictly valid JSON matching the schema. Write all content in ${lang === "he" ? "Hebrew" : "English"}.`,
                },
            });

            const text = response.text;
            if (!text) {
                throw new HttpsError("internal", "No response from AI");
            }

            return JSON.parse(text);
        } catch (error) {
            logger.error("Gemini API Error (Motivation):", error);
            throw new HttpsError(
                "internal",
                `Failed to generate analysis: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }
);
