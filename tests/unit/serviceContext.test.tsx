// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { FirebaseServiceProvider, useAuthService, useFeedbackRepo, useAnalysisService } from '../../services/ServiceContext';
import { IAuthService, IFeedbackRepo, IAnalysisService } from '../../services/types';

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

const stubAnalysis: IAnalysisService = {
  generateMotivationAnalysis: async () => ({
    autonomy: { analysis: '', tip: '' },
    competence: { analysis: '', tip: '' },
    relatedness: { analysis: '', tip: '' },
  }),
};

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseServiceProvider auth={stubAuth} feedbackRepo={stubRepo} analysis={stubAnalysis}>
      {children}
    </FirebaseServiceProvider>
  );
}

describe('FirebaseServiceProvider', () => {
  it('renders children without crashing', () => {
    const { getByText } = render(
      <FirebaseServiceProvider auth={stubAuth} feedbackRepo={stubRepo} analysis={stubAnalysis}>
        <span>hello</span>
      </FirebaseServiceProvider>
    );
    expect(getByText('hello')).toBeTruthy();
  });
});

describe('useAuthService', () => {
  it('returns the IAuthService from the provider', () => {
    const { result } = renderHook(() => useAuthService(), { wrapper });
    expect(result.current).toBe(stubAuth);
  });

  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useAuthService())).toThrow();
  });
});

describe('useFeedbackRepo', () => {
  it('returns the IFeedbackRepo from the provider', () => {
    const { result } = renderHook(() => useFeedbackRepo(), { wrapper });
    expect(result.current).toBe(stubRepo);
  });

  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useFeedbackRepo())).toThrow();
  });
});

describe('useAnalysisService', () => {
  it('returns the IAnalysisService from the provider', () => {
    const { result } = renderHook(() => useAnalysisService(), { wrapper });
    expect(result.current).toBe(stubAnalysis);
  });

  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useAnalysisService())).toThrow();
  });
});
