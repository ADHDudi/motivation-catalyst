import { describe, it, expect } from 'vitest';
import { transition, initialAssessmentState, AssessmentState } from '../../assessmentEngine';
import { QUESTIONS } from '../../constants';

// Question indices at category boundaries (autonomy=0-5, competence=6-11, relatedness=12-17)
const lastAutonomyIdx = QUESTIONS.findIndex((q, i) => i > 0 && QUESTIONS[i - 1].category === 'autonomy' && q.category !== 'autonomy') - 1;
const firstCompetenceIdx = lastAutonomyIdx + 1;
const lastCompetenceIdx = QUESTIONS.findIndex((q, i) => i > 0 && QUESTIONS[i - 1].category === 'competence' && q.category !== 'competence') - 1;
const lastQuestionIdx = QUESTIONS.length - 1;

function answering(index: number, answers = {}): AssessmentState {
  return { type: 'answering', currentQuestionIndex: index, answers };
}

describe('transition — answering', () => {
  it('advances within the same category', () => {
    const state = answering(0);
    const next = transition(state, { type: 'ANSWER_QUESTION', questionId: QUESTIONS[0].id, value: 4 });
    expect(next).toEqual({ type: 'answering', currentQuestionIndex: 1, answers: { [QUESTIONS[0].id]: 4 } });
  });

  it('records the answer before transitioning', () => {
    const state = answering(0);
    const next = transition(state, { type: 'ANSWER_QUESTION', questionId: QUESTIONS[0].id, value: 3 });
    expect((next as any).answers[QUESTIONS[0].id]).toBe(3);
  });

  it('enters categoryIntro when crossing autonomy→competence boundary', () => {
    const state = answering(lastAutonomyIdx);
    const next = transition(state, { type: 'ANSWER_QUESTION', questionId: QUESTIONS[lastAutonomyIdx].id, value: 5 });
    expect(next.type).toBe('categoryIntro');
    if (next.type === 'categoryIntro') {
      expect(next.showingIntroFor).toBe('competence');
      expect(next.pendingIndex).toBe(firstCompetenceIdx);
    }
  });

  it('enters categoryIntro when crossing competence→relatedness boundary', () => {
    const state = answering(lastCompetenceIdx);
    const next = transition(state, { type: 'ANSWER_QUESTION', questionId: QUESTIONS[lastCompetenceIdx].id, value: 2 });
    expect(next.type).toBe('categoryIntro');
    if (next.type === 'categoryIntro') {
      expect(next.showingIntroFor).toBe('relatedness');
    }
  });

  it('enters complete state on the last question', () => {
    const state = answering(lastQuestionIdx);
    const next = transition(state, { type: 'ANSWER_QUESTION', questionId: QUESTIONS[lastQuestionIdx].id, value: 4 });
    expect(next.type).toBe('complete');
    expect((next as any).answers[QUESTIONS[lastQuestionIdx].id]).toBe(4);
  });

  it('BACK decrements currentQuestionIndex', () => {
    const state = answering(3);
    const next = transition(state, { type: 'BACK' });
    expect(next).toEqual({ ...state, currentQuestionIndex: 2 });
  });

  it('BACK is a no-op at index 0', () => {
    const state = answering(0);
    const next = transition(state, { type: 'BACK' });
    expect(next).toBe(state);
  });

  it('ignores CATEGORY_INTRO_READY', () => {
    const state = answering(2);
    expect(transition(state, { type: 'CATEGORY_INTRO_READY' })).toBe(state);
  });
});

describe('transition — categoryIntro', () => {
  const introState: AssessmentState = {
    type: 'categoryIntro',
    showingIntroFor: 'competence',
    pendingIndex: firstCompetenceIdx,
    answers: { 1: 4 },
  };

  it('CATEGORY_INTRO_READY advances to pendingIndex', () => {
    const next = transition(introState, { type: 'CATEGORY_INTRO_READY' });
    expect(next).toEqual({ type: 'answering', currentQuestionIndex: firstCompetenceIdx, answers: { 1: 4 } });
  });

  it('BACK cancels intro and returns to previous question', () => {
    const next = transition(introState, { type: 'BACK' });
    expect(next).toEqual({ type: 'answering', currentQuestionIndex: firstCompetenceIdx - 1, answers: { 1: 4 } });
  });

  it('ignores ANSWER_QUESTION', () => {
    const next = transition(introState, { type: 'ANSWER_QUESTION', questionId: 99, value: 3 });
    expect(next).toBe(introState);
  });
});

describe('transition — complete', () => {
  it('is a terminal state — all events are no-ops', () => {
    const state: AssessmentState = { type: 'complete', answers: { 1: 5 } };
    expect(transition(state, { type: 'ANSWER_QUESTION', questionId: 1, value: 3 })).toBe(state);
    expect(transition(state, { type: 'CATEGORY_INTRO_READY' })).toBe(state);
    expect(transition(state, { type: 'BACK' })).toBe(state);
  });
});

describe('transition — START', () => {
  it('enters autonomy categoryIntro from any state', () => {
    const next = transition(initialAssessmentState, { type: 'START' });
    expect(next).toEqual({ type: 'categoryIntro', showingIntroFor: 'autonomy', pendingIndex: 0, answers: {} });
  });

  it('resets answers when starting fresh', () => {
    const inProgress: AssessmentState = { type: 'answering', currentQuestionIndex: 5, answers: { 1: 4, 2: 3 } };
    const next = transition(inProgress, { type: 'START' });
    expect((next as any).answers).toEqual({});
  });
});

describe('transition — RESUME', () => {
  it('restores answering state at the saved index with saved answers', () => {
    const savedAnswers = { 1: 4, 2: 3, 3: 5 };
    const next = transition(initialAssessmentState, { type: 'RESUME', currentQuestionIndex: 3, answers: savedAnswers });
    expect(next).toEqual({ type: 'answering', currentQuestionIndex: 3, answers: savedAnswers });
  });
});

describe('initialAssessmentState', () => {
  it('starts at question 0 with no answers', () => {
    expect(initialAssessmentState).toEqual({ type: 'answering', currentQuestionIndex: 0, answers: {} });
  });
});
