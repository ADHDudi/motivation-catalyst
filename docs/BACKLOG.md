# Motivation Catalyst — Backlog

## In Progress

- [ ] Update README with full project documentation and business context

---

## 🔴 High Priority

- [x] **AI insights not translated to Hebrew** — switching language to Hebrew after assessment leaves AI-generated insights in English; insights must re-render in the active language
- [ ] **AI Deep Analysis fails with missing API key error** — "Failed to generate analysis: GEMINI_API_KEY environment variable is not set" shown to user; should display a friendly fallback message and gracefully degrade to static insights instead of surfacing a raw error
- [ ] **Raw Firebase error shown in AI Deep Analysis UI** — when Firebase Cloud Functions are unavailable, the raw error string "Firebase: No Firebase App '[DEFAULT]' has been created..." appears as a badge next to each category name (`AnalysisView.tsx:207`); should show a friendly fallback message instead
- [ ] **App blank on localhost — Firebase not initialized** — `/__/firebase/init.js` only loads on Firebase Hosting; on Vite dev server, Firebase SDK loads but `initializeApp()` is never called, crashing the app (`authUtils.ts` partially fixed, `geminiService.ts` still throws)
- [ ] **Implement email/password sign-in** — password field `onChange` is a no-op; wire up Firebase email/password auth (`WelcomeView.tsx:92`)
- [ ] **Implement Sign Up flow** — "Sign up" button has no handler (`WelcomeView.tsx:109`)
- [ ] **Implement Forgot Password** — button is rendered but non-functional (`WelcomeView.tsx:98`)
- [ ] **Post-login redirect** — after Google sign-in, user should auto-advance to assessment (currently stays on welcome screen)
- [ ] **Loading / error states for Google login** — `handleGoogleLogin` catches errors silently; show user-facing feedback

---

## 🟡 Medium Priority

- [ ] **Add manager details to onboarding** — `FormData` has `managerName` / `managerEmail` fields but they are not collected in the welcome form
- [ ] **Email report to manager** — "copy to clipboard" exists; add a direct email-to-manager action using `formData.managerEmail`
- [ ] **Save results to Firestore** — persist results per user so history is accessible on re-login
- [ ] **Progress persistence** — allow resuming an in-progress assessment (localStorage or Firestore)
- [ ] **"Start All Over Again" button on every results tab** — currently only the "Results & Analysis" tab has a reset action; add it to the bottom of each tab in `AnalysisView.tsx`
- [ ] **Polar chart labels always bilingual** — labels hardcoded as "Hebrew (ENGLISH)"; in English mode this renders "Autonomy (AUTONOMY)" which is redundant; should show only the active language (`ResultPolarChart.tsx:86`)
- [x] **Hardcoded English strings in AI section** — "Generating personalized insights..." and "AI Personalized" badge are not translated; both must respect the active language (`AnalysisView.tsx:206,208`)
- [x] **AI insights don't regenerate on language switch** — `aiInsights` guard in useEffect prevents re-fetch when `lang` changes, so insights stay in the language of the original request (`AnalysisView.tsx:100`)
- [ ] **Mobile keyboard handling** — verify form inputs don't get obscured by soft keyboard on iOS/Android
- [ ] **Configure webhook URL** — `WEBHOOK_URL` in `constants.ts` appears to be a placeholder; document setup steps

---

## 🟢 Low Priority

- [ ] **Results history view** — let a returning user see past assessments and track trends over time *(depends on: Save results to Firestore)*
- [ ] **Back navigation on first question** — currently goes back to welcome screen; consider a confirmation prompt
- [ ] **Demo mode discoverability** — currently hidden behind typing "dudi"; use a proper dev/staging flag
- [ ] **Webhook misconfiguration warning** — `syncData` only logs a `console.warn`; make this visible in non-production environments
- [ ] **Set up CI/CD** — automate `deploy.sh` via GitHub Actions on push to `main`
- [ ] **Environment-based config** — separate Firebase projects / configs for dev vs prod

---

## Done

- [x] Google Authentication integration
- [x] SDT assessment with Autonomy / Competence / Relatedness scoring
- [x] Polar chart results visualization
- [x] Bilingual support (Hebrew / English)
- [x] AI-generated personal insights and manager recommendations
- [x] Copy full report to clipboard
- [x] Demo mode (high / mid / at-risk profiles)
- [x] Firebase Hosting deployment
- [x] Webhook-based data sync for submissions and interactions
