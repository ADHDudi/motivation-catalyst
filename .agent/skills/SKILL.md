---
name: motivation-catalyst-project-context
description: Key environment info, URLs, API keys, and project conventions for the Motivation Catalyst app. Read this before making changes or running any commands.
---

# Motivation Catalyst — Project Context

## URLs

| Environment       | URL                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------- |
| **Local Dev**     | http://localhost:5173 (run `npm run dev`)                                                    |
| **Firebase Live** | https://motivation-catalyst-david.web.app                                                    |
| **Firebase Console** | https://console.firebase.google.com/project/motivation-catalyst-david/overview            |
| **GitHub Repo**   | https://github.com/ADHDudi/motivation-catalyst                                               |

## Firebase Project

- **Project ID**: `motivation-catalyst-david`
- **Hosting**: https://motivation-catalyst-david.web.app
- **Functions region**: `us-central1`
- **Runtime**: Node.js 22 (Gen 2)
- **Functions deployed**:
  - `generateInsights` — Generates co-founder compatibility insights
  - `generateMotivationAnalysis` — Generates SDT-based motivation analysis with ADHD tips

## Environment Variables

### `functions/.env` (Cloud Functions — NOT committed to git)
```
GEMINI_API_KEY=your_api_key_here
```
> ⚠️ If the key expires or is missing, a valid API key must be provided. It should be placed in `functions/.env`.

### `.env.local` (Frontend — NOT committed to git)
- Not currently used (API calls go via Cloud Functions, not frontend)

## npm Scripts

| Script             | Description                                      |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Start local dev server at **http://localhost:5173** |
| `npm run build`    | Build for production (outputs to `dist/`)       |
| `npm run deploy`   | Run `deploy.sh` → builds + deploys to Firebase  |
| `npm run test`     | Run Playwright tests against **Firebase live**  |
| `npm run test:local`| Run Playwright tests against **localhost:5173** |
| `npm run test:live`| Run Playwright tests against **Firebase live**  |
| `npm run report`   | Open Playwright HTML report                     |

## Deployment Notes

- **Deploy script**: `deploy.sh` — uses an isolated build dir at `/tmp/motivation-deploy-auto` to work around macOS filesystem permission issues (`EPERM`).
- The `functions/.env` file **cannot be rsynced** (permission-locked). The deploy script injects the API key directly by writing to `$DEPLOY_DIR/functions/.env`.
- The script automatically Git commits + pushes before deploying.
- After deploy, it opens the Firebase live URL in the browser.

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | React + TypeScript + Vite               |
| Styling   | Vanilla CSS (`index.css`)               |
| Backend   | Firebase Cloud Functions (Gen 2, TS)    |
| AI        | Google Gemini via `@google/genai` SDK   |
| Database  | Firebase Firestore                      |
| Hosting   | Firebase Hosting                        |
| Testing   | Playwright                              |

## Key Files

| File                          | Purpose                                      |
| ----------------------------- | -------------------------------------------- |
| `deploy.sh`                   | One-command: git sync + build + Firebase deploy |
| `vite.config.ts`              | Dev server config (port **5173**)            |
| `playwright.config.ts`        | Test config; respects `BASE_URL` env var     |
| `functions/src/index.ts`      | Cloud Functions source (AI endpoints)        |
| `functions/.env`              | Secret API keys for functions (not in git)   |
| `views/AnalysisView.tsx`      | Main analysis + ADHD tips display component  |
| `views/AssessmentView.tsx`    | Question flow component                      |
| `views/WelcomeView.tsx`       | Welcome / registration screen                |
| `types.ts`                    | Shared TypeScript interfaces                 |
| `tests/acceptance.spec.ts`    | Main Playwright acceptance tests             |
