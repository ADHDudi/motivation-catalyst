<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Motivation Catalyst

Welcome to **Motivation Catalyst** — an innovative assessment and insights platform built on **Self-Determination Theory (SDT)**. This document guides you through running the project locally and explains the app from three key perspectives: business value, the end-to-end user journey, and the outputs users receive.

---

## Quick Start

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app locally:
   ```bash
   npm run dev
   ```

> **Note:** Firebase is automatically initialized for localhost via `firebaseConfig.ts`. No additional environment setup is needed for local development — Google Sign-In and Firestore work out of the box.

## Environments

| Environment  | URL |
| ------------ | --- |
| **Local Dev**    | http://localhost:5173 (run `npm run dev`) |
| **Firebase Live**| https://motivation-catalyst-david.web.app |
| **Firebase Console** | https://console.firebase.google.com/project/motivation-catalyst-david/overview |

---

## 1. Business Value Perspective

**Motivation Catalyst** is a scientific motivation assessment tool grounded in **Self-Determination Theory (SDT)**, which identifies three basic psychological needs essential for well-being: **Autonomy**, **Competence**, and **Relatedness**.

### Core Objectives

* **Scientific Framework & Workplace Analytics:** The app evaluates employee motivation across three critical axes:
  - **Autonomy** — The need to control one's work and have agency
  - **Competence** — The need for mastery and effectiveness
  - **Relatedness** — The need to belong and connect with others

* **Early Intervention for At-Risk Talent:** By identifying low motivation scores, managers and organizations can proactively intervene before burnout or turnover occurs.

* **Managerial Enablement:** The tool bridges the gap between employee sentiment and management action, equipping leadership with direct feedback and practical recommendations tailored to each team member's unique motivational profile.

* **Neurodivergent Inclusivity:** The application integrates specialized AI to generate tailored workplace and coaching tips for individuals with ADHD and other neurodivergent profiles, ensuring advice is actionable and accommodating to diverse work styles.

* **Bridge Communication Gaps:** It acts as a facilitator between employees and managers, establishing mutual understanding and aligning goals for better productivity and job satisfaction.

---

## 2. User Journey

The application flows seamlessly, fostering self-reflection and communication:

### Step 1: Onboarding & Welcome (`WelcomeView`)
* Users land on the platform and receive a brief introduction to Self-Determination Theory.
* They learn about the value of understanding their core motivations and how it solves common workplace pain points.
* Users authenticate via **Google Sign-In**, **Email/Password Sign In**, or **Sign Up** with email.
* They enter their basic details (Name, Email) and optional manager context to begin the assessment.
* A **Demo Mode** is available by entering `dudi` as name — launches a pre-filled analysis without authentication.

### Step 2: The Assessment (`AssessmentView`)
* Users answer a weighted questionnaire (18 questions) assessing their levels of Autonomy, Competence, and Relatedness.
* The application features built-in localization (Hebrew/English) and tracks question progress dynamically.
* Users receive continuous feedback as they progress through the intuitive questionnaire.

### Step 3: AI-Powered Analysis
* Once the assessment is complete, the application communicates securely with a Firebase Cloud Functions backend.
* Using the Google Gemini API, the system formulates deep psychological models matching the user's questionnaire scores.
* It generates distinct insights based on whether the user scored High, Mid, or At-Risk (Low) in the SDT categories.

### Step 4: Reviewing Results (`AnalysisView`)
* Users are presented with a rich, interactive summary of their motivation footprint.
* The UI displays a visual output (a **Polar Chart**) mapping results across the three SDT axes.
* Users can view:
  - **Personal Insights:** Psychological breakdown of current state and recommended self-improvement actions
  - **Manager Recommendations:** Specific steps managers can take to improve performance and well-being
  - **AI Deep Analysis:** Curated mental strategies and workflow tips matching the user's specific profile
  - **ADHD-Specific Guidance:** Neurodivergent-friendly strategies and accommodations

### Step 5: Legal Pages (`/terms`, `/privacy`, `/accessibility`)
* Accessible from footer links on the Welcome and Analysis views.
* All three pages are bilingual (Hebrew/English) and automatically open in the user's active language.
* Built under Israeli law: Privacy Protection Law 5741-1981, Accessibility Regulations 5773-2013.

---

## 3. Outputs and Artifacts

By completing the motivation assessment, users generate a set of highly actionable artifacts:

### The SDT Motivation Snapshot
* Quantitative scoring (out of 5.0) for Autonomy, Competence, and Relatedness
* Visual representation via an interactive polar chart

### Dual-Target Analytical Briefs
* **Personal Insights:** A psychological breakdown with recommended self-improvement or communication actions
* **Manager Recommendations:** Specific, actionable steps for leadership to support the employee, such as:
  - Offering flexible deadlines
  - Increasing feedback loops
  - Assigning a mentor
  - Creating autonomy opportunities

### Actionable AI & ADHD Tips
* **For Employees:** Direct strategies on how to approach tasks, communicate boundaries, ask for help — customized with specialized ADHD executive function hacks
* **For Managers:** Guidance on how to best manage, support, and communicate based on the user's specific motivational profile

### Conversation Starters
* Practical talking points designed to help individuals initiate productive conversations with their managers regarding their needs

### Shareable Deliverables
* **Copy Full Report:** Users can easily copy the entire analysis to clipboard in a cleanly formatted text report
* **Visual Data:** The polar chart visualization provides a quick, digestible artifact for performance reviews or 1-on-1 meetings

---

## Architecture Overview

**Tech Stack:**
* React 19 + TypeScript
* Vite (dev server + build)
* React Router DOM v7 (client-side routing for legal pages)
* Firebase Authentication (email/password + Google Sign-In)
* Firebase Firestore (feedback storage)
* Firebase Cloud Functions (Gemini AI backend)
* Google Gemini API (AI-powered insights)
* Tailwind CSS via CDN (styling — B2C Just AI It design system)
* Lucide React (icons)
* Playwright (end-to-end testing across Chromium, Firefox, WebKit)

**Design System:**
The UI follows the **Just AI It B2C design system** — a blue-forward palette replacing the previous violet theme:

| Token | Value | Usage |
|-------|-------|-------|
| `--b2c-azure` | `#1F7AFF` | Primary actions, links |
| `--b2c-sky` | `#38BDF8` | Competence, secondary highlights |
| `--b2c-deep` | `#0B3D91` | Headings |
| `--b2c-mist` | `#EAF2FF` | AI insights background |
| `--b2c-ice` | `#F4F8FF` | Page background |
| `--b2c-ink` | `#0A1A33` | Body text |
| `--b2c-violet` | `#8C50F0` | Accent (Autonomy) |
| `--b2c-cyan` | `#3CDCF0` | Relatedness |

**Routing:**
| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `App` (WelcomeView → AssessmentView → AnalysisView) | Step-based SPA flow |
| `/terms` | `TermsView` | Lazy-loaded |
| `/privacy` | `PrivacyView` | Lazy-loaded |
| `/accessibility` | `AccessibilityView` | Lazy-loaded |

**Firebase Local Development:**
Firebase credentials are provided via `firebaseConfig.ts` for localhost. In production, Firebase Hosting auto-injects credentials via `/__/firebase/init.js`. Never commit new API keys — the existing `firebaseConfig.ts` values are the project's public SDK config (safe to commit for Firebase web apps).

**Key Features:**
* Bilingual (Hebrew RTL / English LTR) with language persisted to `localStorage`
* Demo mode for testing without authentication
* Legal compliance pages (Terms, Privacy, Accessibility) — Israeli law
* Real-time assessment progress tracking
* Firebase-based authentication (Google OAuth + email/password)
* AI-generated personalized insights via Gemini
* Responsive layout (mobile / tablet / desktop)
* E2E test suite: 93 tests across 3 browsers

---

## Testing

```bash
# Run all tests (defaults to localhost:5173)
npm test

# Run against production
npm run test:live

# View last test report
npm run report
```

Tests cover: welcome screen, authentication flows (sign in, sign up, forgot password, Google), assessment journey, analysis view, language toggling, feedback form, and demo mode.
