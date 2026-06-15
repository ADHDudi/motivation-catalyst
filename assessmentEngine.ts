import { Answers, CategoryKey } from './types';
import { QUESTIONS } from './constants';

export type AssessmentState =
  | { type: 'answering'; currentQuestionIndex: number; answers: Answers }
  | { type: 'categoryIntro'; showingIntroFor: CategoryKey; pendingIndex: number; answers: Answers }
  | { type: 'complete'; answers: Answers };

export type AssessmentEvent =
  | { type: 'ANSWER_QUESTION'; questionId: number; value: number }
  | { type: 'CATEGORY_INTRO_READY' }
  | { type: 'BACK' }
  | { type: 'START' }
  | { type: 'RESUME'; currentQuestionIndex: number; answers: Answers };

export const initialAssessmentState: AssessmentState = {
  type: 'answering',
  currentQuestionIndex: 0,
  answers: {},
};

export function transition(state: AssessmentState, event: AssessmentEvent): AssessmentState {
  if (event.type === 'START') {
    return { type: 'categoryIntro', showingIntroFor: 'autonomy', pendingIndex: 0, answers: {} };
  }
  if (event.type === 'RESUME') {
    return { type: 'answering', currentQuestionIndex: event.currentQuestionIndex, answers: event.answers };
  }

  switch (state.type) {
    case 'answering': {
      if (event.type === 'ANSWER_QUESTION') {
        const answers = { ...state.answers, [event.questionId]: event.value };
        const nextIndex = state.currentQuestionIndex + 1;

        if (nextIndex >= QUESTIONS.length) {
          return { type: 'complete', answers };
        }

        const currentCat = QUESTIONS[state.currentQuestionIndex].category;
        const nextCat = QUESTIONS[nextIndex].category;

        if (nextCat !== currentCat) {
          return { type: 'categoryIntro', showingIntroFor: nextCat, pendingIndex: nextIndex, answers };
        }

        return { ...state, currentQuestionIndex: nextIndex, answers };
      }

      if (event.type === 'BACK') {
        if (state.currentQuestionIndex === 0) return state;
        return { ...state, currentQuestionIndex: state.currentQuestionIndex - 1 };
      }

      return state;
    }

    case 'categoryIntro': {
      if (event.type === 'CATEGORY_INTRO_READY') {
        return { type: 'answering', currentQuestionIndex: state.pendingIndex, answers: state.answers };
      }

      if (event.type === 'BACK') {
        return { type: 'answering', currentQuestionIndex: state.pendingIndex - 1, answers: state.answers };
      }

      return state;
    }

    case 'complete':
      return state;
  }
}
