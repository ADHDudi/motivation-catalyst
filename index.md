# Motivation Catalyst - Project Index

This document provides a comprehensive index of the project's source code and configuration files. It is intended to help developers navigate the project structure and understand the purpose of key modules.

## Directories

### `components/`
Contains reusable UI components for the React application.
- **`AccordionItem.tsx`**: A collapsible UI component for displaying content sections.
- **`ConversationStarter.tsx`**: UI to display coaching tips or suggested conversation topics.
- **`Logo.tsx`**: The main application logo SVG/component.
- **`ResultPolarChart.tsx`**: A component for rendering polar charts to visualize assessment results.

### `functions/`
Contains the Firebase Cloud Functions backend code.
- **`src/index.ts`**: The main entry point for the cloud functions (e.g., `generateInsights`, `generateMotivationAnalysis`).
- **`.env` / `.env.example`**: Environment variables (e.g., `GEMINI_API_KEY`).

### `services/`
Contains modular business logic and external service integrations.
- **`geminiService.ts`**: Helper service to interact with the Google Gemini API to generate insights.

### `views/`
Contains the main page views of the application.
- **`AnalysisView.tsx`**: The main page that displays motivation analysis, ADHD tips, and gap analysis results.
- **`AssessmentView.tsx`**: The view handling the questionnaire presentation and user input.
- **`WelcomeView.tsx`**: The initial landing, onboarding, or registration screen.

### `tests/`
Contains automated test scenarios using Playwright.

## Root Configuration Files
- **`vite.config.ts`**: Configuration for Vite, used by the dev server and production builds.
- **`playwright.config.ts`**: End-to-end testing configuration.
- **`firebase.json` / `.firebaserc`**: Configuration for Firebase services (Hosting, Functions, Firestore).
- **`deploy.sh`**: A deployment script to build and deploy to Firebase.
- **`App.tsx`**: Main React App entry point, routing to the various views.

## Documentation
- **`.agent/skills/SKILL.md`**: Dedicated BMad project context instructions for AI agents.
- **`README.md`**: Main project repository instructions.
