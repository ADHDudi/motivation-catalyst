import { Answers, CategoryKey, Results } from './types';
import { QUESTIONS } from './constants';

export const THRESHOLD = 3.5;

export function calculateScores(answers: Answers): Results {
  const sums: Record<CategoryKey, number> = { autonomy: 0, competence: 0, relatedness: 0 };
  const counts: Record<CategoryKey, number> = { autonomy: 0, competence: 0, relatedness: 0 };

  QUESTIONS.forEach(q => {
    const val = answers[q.id] ?? 3;
    sums[q.category] += q.weight === 1 ? val : 6 - val;
    counts[q.category]++;
  });

  return {
    autonomy: sums.autonomy / counts.autonomy,
    competence: sums.competence / counts.competence,
    relatedness: sums.relatedness / counts.relatedness,
  };
}

export function isLow(score: number): boolean {
  return score < THRESHOLD;
}

export function getPriorityCategory(scores: Results): CategoryKey {
  return (Object.keys(scores) as CategoryKey[]).reduce((lowest, key) =>
    scores[key] < scores[lowest] ? key : lowest
  );
}
