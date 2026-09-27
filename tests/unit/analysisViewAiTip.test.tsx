// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AnalysisView from '../../views/AnalysisView';
import { FirebaseServiceProvider } from '../../services/ServiceContext';
import { IAuthService, IFeedbackRepo, IAnalysisService } from '../../services/types';
import { QUESTIONS, TRANSLATIONS } from '../../constants';
import { calculateScores } from '../../motivationCalculator';
import { Answers } from '../../types';

const stubAuth: IAuthService = {
  signInWithGoogle: async () => null,
  signOutUser: async () => {},
  onAuthStateChange: () => () => {},
  signInWithEmail: async () => null,
  signUpWithEmail: async () => null,
  sendPasswordReset: async () => {},
};

const stubRepo: IFeedbackRepo = {
  saveFeedback: async () => {},
  saveUserFeedback: async () => {},
  listFeedbacks: async () => [],
  updateFeedbackRead: async () => {},
};

// All answers at 3 → every category is "low" (below the 3.5 threshold)
const answers: Answers = Object.fromEntries(QUESTIONS.map(q => [q.id, 3]));
const t = TRANSLATIONS.he;
const staticAutonomyTip = t.deepAnalysis.autonomy.employee.low.aiTips;

function renderAnalysis(analysis: IAnalysisService) {
  return render(
    <MemoryRouter>
      <FirebaseServiceProvider auth={stubAuth} feedbackRepo={stubRepo} analysis={analysis}>
        <AnalysisView
          t={t}
          lang="he"
          setLang={() => {}}
          userRole="employee"
          formData={{ employeeName: '', employeeEmail: '', managerName: '', managerEmail: '' }}
          results={calculateScores(answers)}
          onReset={() => {}}
          copyToClipboard={() => {}}
          generateFullReportText={() => ''}
          statusMsg=""
          answers={answers}
        />
      </FirebaseServiceProvider>
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe('AnalysisView — AI tip', () => {
  it('falls back to the static tip and stops "Generating..." when the AI call fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderAnalysis({
      generateMotivationAnalysis: async () => {
        throw new Error('GEMINI_API_KEY environment variable is not set');
      },
    });

    expect(await screen.findByText(staticAutonomyTip)).toBeTruthy();
    expect(screen.queryByText('מייצר...')).toBeNull();
  });

  it('shows the personalized tip and stops "Generating..." when the AI call succeeds', async () => {
    const category = (tip: string) => ({ analysis: '', tip, adhd_tip: '' });
    renderAnalysis({
      generateMotivationAnalysis: async () => ({
        autonomy: category('טיפ AI אישי'),
        competence: category(''),
        relatedness: category(''),
      }),
    });

    expect(await screen.findByText('טיפ AI אישי')).toBeTruthy();
    expect(screen.getByText('מותאם')).toBeTruthy();
    expect(screen.queryByText('מייצר...')).toBeNull();
  });
});
