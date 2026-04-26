<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Motivation Catalyst

Welcome to the **Motivation Catalyst** app! This document guides you through running the project locally, and breaks down the project from three key angles: the core business value, the end-to-end user journey, and the concrete outputs users receive.

---

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

View your app in AI Studio: https://ai.studio/apps/drive/1lqunQla3uPI2xRCwJq-5Qbxs4YLHM-Rw

## URLs

| Environment  | URL                                                        |
| ------------ | ---------------------------------------------------------- |
| **Local Dev**    | http://localhost:5173 (run `npm run dev`)               |
| **Firebase Live**| https://motivation-catalyst-david.web.app               |
| **Firebase Console** | https://console.firebase.google.com/project/motivation-catalyst-david/overview |

---

## 1. Business Value Perspective

The Motivation Catalyst application is a scientific motivation assessment tool based on **Self-Determination Theory (SDT)**. It is designed to help employees and managers improve workplace dynamics by measuring core psychological needs. Its primary business value includes:

* **Scientific Framework & Workplace Analytics:** Grounded in SDT, the app evaluates employee motivation across three critical axes: **Autonomy** (the need to control one's work), **Competence** (the need for mastery), and **Relatedness** (the need to belong).
* **Early Intervention for "At-Risk" Talent:** By identifying low motivation scores, managers and organizations can proactively intervene before burnout or turnover occurs.
* **Managerial Enablement:** The tool bridges the gap between employee sentiment and management action. It equips leadership with direct feedback and practical recommendations on how to support each specific team member based on their unique motivational profile.
* **Neurodivergent Context:** The app offers specialized guidance (e.g., specific ADHD executive function hacks) within the context of core motivations, ensuring diverse mindsets are understood and engaged effectively.

---

## 2. User Journey

The application flows seamlessly, fostering self-reflection and communication:

1. **Onboarding & Context Setting:**
   * The user arrives at the platform and views an introduction to intrinsic drivers. They enter their name, email, and their manager's details. They can also seamlessly authenticate via Google Authentication.
2. **The Assessment Interface:**
   * The user answers a series of structured questions, evaluating themselves on specific statements related to workplace autonomy, mastery, and relationships.
   * Feedback is gathered continuously as they progress through the intuitive questionnaire.
3. **Instant Profile Analysis:**
   * Upon completing the assessment, the app instantly reveals the employee's Motivation Catalyst dashboard.
   * The user receives a visually coded breakdown of their scores across the three SDT axes.
4. **Deep Dive & Actionable Guidance:**
   * Beyond raw scores, the internal engine triggers deep analysis. It provides "Personal Insights" for the employee to reflect on, and parallel "Manager Recommendations."
5. **Engagement & Sharing:**
   * The user can review AI-driven strategy tips and easily bundle the entire report to a clipboard format, ready to be sent to their manager for a constructive alignment conversation.

---

## 3. Outputs and Artifacts Provided to the User

By completing the motivation assessment, the user generates a set of highly actionable artifacts:

* **The SDT Motivation Snapshot:** A quantitative scoring (out of 5.0) of Autonomy, Competence, and Relatedness.
* **Dual-Target Analytical Briefs:**
  * **Personal Insights:** A psychological breakdown of the employee's current state and recommended self-improvement or communication actions.
  * **Manager Recommendations:** Specific steps a manager must take (e.g., offering more flexible deadlines, increasing feedback loops, or assigning a mentor) to improve performance and well-being.
* **Strategic AI Tips:** Curated mental strategies and workflow tips mapping directly to their lowest or highest driving factors.
* **The Final Report Deliverable:** A cleanly formatted text report encompassing all analysis and recommended actions, easily copied or emailed directly to leadership to initiate immediate change.
