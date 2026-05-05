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

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

View your app in AI Studio: https://ai.studio/apps/drive/1lqunQla3uPI2xRCwJq-5Qbxs4YLHM-Rw

## Environments

| Environment  | URL                                                        |
| ------------ | ---------------------------------------------------------- |
| **Local Dev**    | http://localhost:5173 (run `npm run dev`)               |
| **Firebase Live**| https://motivation-catalyst-david.web.app               |
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

* **Bridge Communication Gaps:** It acts as a facilitator between employees and managers (or between co-founders), establishing mutual understanding and aligning goals for better productivity and job satisfaction.

---

## 2. User Journey

The application flows seamlessly, fostering self-reflection and communication:

### Step 1: Onboarding & Welcome (`WelcomeView`)
* Users land on the platform and receive a brief introduction to Self-Determination Theory.
* They learn about the value of understanding their core motivations and how it solves common workplace pain points.
* Users authenticate via **Google Sign-In**, **Email/Password Sign In**, or **Sign Up** with email.
* They enter their basic details (Name, Email) and optional manager context to begin the assessment.

### Step 2: The Assessment (`AssessmentView`)
* Users answer a weighted questionnaire (18 questions) assessing their levels of Autonomy, Competence, and Relatedness.
* The application features built-in localization (English/Hebrew) and tracks question progress dynamically.
* Users receive continuous feedback as they progress through the intuitive questionnaire.

### Step 3: AI-Powered Analysis
* Once the assessment is complete, the application communicates securely with a Firebase Cloud Functions backend.
* Using the Google Gemini API, the system formulates deep psychological models matching the user's questionnaire scores.
* It generates distinct insights based on whether the user scored High, Mid, or At-Risk (Low) in the SDT categories.

### Step 4: Reviewing Results (`AnalysisView`)
* Users are presented with a rich, interactive summary of their motivation footprint.
* The UI displays a visual output (such as a **Polar Chart**) mapping results across the three SDT axes.
* Users can view:
  - **Personal Insights:** Psychological breakdown of current state and recommended self-improvement actions
  - **Manager Recommendations:** Specific steps managers can take to improve performance and well-being
  - **AI Deep Analysis:** Curated mental strategies and workflow tips matching the user's specific profile
  - **ADHD-Specific Guidance:** Neurodivergent-friendly strategies and accommodations

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
* **For Managers (or Co-founders):** Guidance on how to best manage, support, and communicate based on the user's specific motivational profile

### Conversation Starters
* Generated by the AI, these are practical scenarios or talking points designed to help individuals initiate difficult or productive conversations with their managers regarding their needs

### Shareable Deliverables
* **Copy Full Report:** Users can easily copy the entire analysis to clipboard in a cleanly formatted text report
* **Email Prep:** Users can automatically generate a pre-drafted email to initiate transparent dialogue with leadership
* **Visual Data:** The polar chart visualization provides a quick, digestible artifact perfect for performance reviews or 1-on-1 meetings

---

## Architecture Overview

**Tech Stack:**
* React 19 + TypeScript
* Vite (dev server)
* Firebase Authentication (email/password, Google Sign-In)
* Firebase Cloud Functions (backend analysis)
* Google Gemini API (AI-powered insights)
* Tailwind CSS (styling)
* Playwright (end-to-end testing)

**Key Features:**
* Bilingual support (Hebrew/English)
* Real-time assessment progress tracking
* Firebase-based user authentication
* AI-generated personalized insights
* Responsive, accessible UI with ARIA labels
