// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firebaseAnalysisService } from '../../services/firebaseAdapters';
import { AnalysisServiceError } from '../../services/types';

const validResult = {
  autonomy:   { analysis: 'a-analysis', tip: 'a-tip', adhd_tip: 'a-adhd' },
  competence: { analysis: 'c-analysis', tip: 'c-tip' },
  relatedness:{ analysis: 'r-analysis', tip: 'r-tip' },
};

const mockResponses = [{ id: 1, text: 'q', score: 4, category: 'autonomy' }];

function makeFirebaseMock(returnData: any) {
  return {
    apps: [{}],
    functions: () => ({
      httpsCallable: () => async () => ({ data: returnData }),
    }),
  };
}

beforeEach(() => {
  vi.unstubAllGlobals();
  vi.stubGlobal('firebase', makeFirebaseMock(validResult));
});

// ─── happy path ───────────────────────────────────────────────────────────────

describe('generateMotivationAnalysis', () => {
  it('returns a valid MotivationAnalysisResult as-is', async () => {
    const result = await firebaseAnalysisService.generateMotivationAnalysis(
      mockResponses, 'Dudi', 'Boss', 'he'
    );
    expect(result).toEqual(validResult);
  });

  // ─── validation ─────────────────────────────────────────────────────────────

  it('throws AnalysisServiceError when a category is missing', async () => {
    const bad = { autonomy: { analysis: 'x', tip: 'y' }, competence: { analysis: 'x', tip: 'y' } };
    vi.stubGlobal('firebase', makeFirebaseMock(bad));
    await expect(
      firebaseAnalysisService.generateMotivationAnalysis(mockResponses, 'Dudi', 'Boss', 'he')
    ).rejects.toThrow(AnalysisServiceError);
  });

  it('throws AnalysisServiceError when a category has wrong shape', async () => {
    const bad = {
      autonomy:   { analysis: 'x', tip: 42 },   // tip is not a string
      competence: { analysis: 'x', tip: 'y' },
      relatedness:{ analysis: 'x', tip: 'y' },
    };
    vi.stubGlobal('firebase', makeFirebaseMock(bad));
    await expect(
      firebaseAnalysisService.generateMotivationAnalysis(mockResponses, 'Dudi', 'Boss', 'he')
    ).rejects.toThrow(AnalysisServiceError);
  });

  it('throws when Firebase is not ready', async () => {
    vi.stubGlobal('firebase', { apps: [] });
    await expect(
      firebaseAnalysisService.generateMotivationAnalysis(mockResponses, 'Dudi', 'Boss', 'he')
    ).rejects.toThrow();
  });
});
