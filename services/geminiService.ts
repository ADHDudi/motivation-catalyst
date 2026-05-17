import { CategoryKey, UserRole } from '../types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string | undefined;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface AiAnalysisResult {
  [key: string]: string | undefined;  // CategoryKey -> aiTips string
}

export async function generateMotivationAnalysis(
  scores: Record<CategoryKey, string>,
  lang: 'he' | 'en',
  userRole: UserRole
): Promise<AiAnalysisResult> {
  if (!GEMINI_API_KEY) {
    return {};
  }

  const roleContext = userRole === 'manager'
    ? (lang === 'he'
        ? 'אתה מנהל/ת צוות. הטיפים צריכים להיות בגוף שני למנהל, על מה לנסות השבוע עם הצוות שלך.'
        : 'You are a team manager. Tips should be in second person to the manager, about what to try this week with your team.')
    : (lang === 'he'
        ? 'אתה עובד/ת בצוות. הטיפים צריכים להיות בגוף שני לעובד/ת, על מה לנסות השבוע.'
        : 'You are an individual contributor on a team. Tips should be in second person to the employee, about what to try this week.');

  const categoryNames: Record<CategoryKey, string> = lang === 'he'
    ? { autonomy: 'אוטונומיה', competence: 'מסוגלות', relatedness: 'שייכות' }
    : { autonomy: 'Autonomy', competence: 'Competence', relatedness: 'Relatedness' };

  const prompt = lang === 'he'
    ? `${roleContext}\n\nציונים:\n${Object.entries(scores).map(([k, v]) => `${categoryNames[k as CategoryKey]}: ${v}/5`).join('\n')}\n\nעבור כל קטגוריה, כתוב טיפ מעשי אחד קצר (1-2 משפטים). החזר JSON בלבד:\n{"autonomy":"...","competence":"...","relatedness":"..."}`
    : `${roleContext}\n\nScores:\n${Object.entries(scores).map(([k, v]) => `${categoryNames[k as CategoryKey]}: ${v}/5`).join('\n')}\n\nFor each category, write one short practical tip (1-2 sentences). Return JSON only:\n{"autonomy":"...","competence":"...","relatedness":"..."}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
      })
    });

    if (!response.ok) return {};

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return {};

    const parsed = JSON.parse(jsonMatch[0]);
    const result: AiAnalysisResult = {};
    (['autonomy', 'competence', 'relatedness'] as CategoryKey[]).forEach(cat => {
      if (typeof parsed[cat] === 'string') result[cat] = parsed[cat];
    });
    return result;
  } catch {
    return {};
  }
}
