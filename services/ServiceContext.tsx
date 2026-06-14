import React, { createContext, useContext } from 'react';
import { IAuthService, IFeedbackRepo, IAnalysisService } from './types';

interface ServiceContextValue {
  auth: IAuthService;
  feedbackRepo: IFeedbackRepo;
  analysis: IAnalysisService;
}

const ServiceContext = createContext<ServiceContextValue | null>(null);

interface FirebaseServiceProviderProps {
  auth: IAuthService;
  feedbackRepo: IFeedbackRepo;
  analysis: IAnalysisService;
  children: React.ReactNode;
}

export function FirebaseServiceProvider({ auth, feedbackRepo, analysis, children }: FirebaseServiceProviderProps) {
  return (
    <ServiceContext.Provider value={{ auth, feedbackRepo, analysis }}>
      {children}
    </ServiceContext.Provider>
  );
}

function useServiceContext(): ServiceContextValue {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('Service hooks must be used within <FirebaseServiceProvider>');
  return ctx;
}

export function useAuthService(): IAuthService {
  return useServiceContext().auth;
}

export function useFeedbackRepo(): IFeedbackRepo {
  return useServiceContext().feedbackRepo;
}

export function useAnalysisService(): IAnalysisService {
  return useServiceContext().analysis;
}
