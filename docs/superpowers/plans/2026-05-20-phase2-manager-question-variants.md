# Phase 2 — Manager Question Variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add manager-context variants of all 18 SDT assessment questions so managers see questions reframed around "the people I lead" rather than their own experience, while scoring math stays identical.

**Architecture:** `Question` gets an optional `managerText` field. `AssessmentView` receives `userRole` and renders `managerText[lang]` when the user is a manager and the property exists; otherwise falls back to `text[lang]`. `App.tsx` adds `questionVariant` to the webhook submission. No new files — four targeted edits.

**Tech Stack:** React 18, TypeScript, Vite. No test runner — verification is TypeScript build + visual dev-server check.

---

## File Map

| File | Change |
|---|---|
| `types.ts` | Add `managerText?: LocalizedText` to `Question` interface |
| `constants.ts` | Populate `managerText` on all 18 `QUESTIONS` entries (HE + EN) |
| `views/AssessmentView.tsx` | Accept `userRole: UserRole` prop; pick `managerText` when available |
| `App.tsx` | Add `questionVariant: 'manager' \| 'employee'` to `syncData` submission |

---

## Task 1: Extend the `Question` type

**Files:**
- Modify: `types.ts`

- [ ] **Step 1: Add `managerText` to the `Question` interface**

In `types.ts`, find the `Question` interface (currently lines 27-32) and add the optional field:

```ts
export interface Question {
  id: number;
  category: CategoryKey;
  text: LocalizedText;
  managerText?: LocalizedText;   // ← add this line
  weight: number;
}
```

- [ ] **Step 2: Verify TypeScript still compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. The field is optional so existing `QUESTIONS` entries without it are still valid.

- [ ] **Step 3: Commit**

```bash
git add types.ts
git commit -m "feat(phase2): add optional managerText field to Question type"
```

---

## Task 2: Author all 18 manager-context question variants

**Files:**
- Modify: `constants.ts`

This task adds `managerText` to every entry in the `QUESTIONS` array. The authoring rubric (from the spec):
- Subject becomes "the people I lead" / "my team" / "חברי הצוות שלי"
- Verb becomes an action the manager owns
- SDT factor (autonomy / competence / relatedness) and weight polarity (1 / −1) are unchanged

- [ ] **Step 1: Add `managerText` to all 18 questions**

Replace the entire `QUESTIONS` array in `constants.ts` with the version below. Every entry is a copy of the existing object with one extra `managerText` field added:

```ts
export const QUESTIONS: Question[] = [
  // ── AUTONOMY ──────────────────────────────────────────────────────────────
  {
    id: 1, category: 'autonomy', weight: 1,
    text: { he: "אני מרגיש שיש לי אפשרות לבחור כיצד לבצע את עבודתי.", en: "I can choose how to perform my work." },
    managerText: { he: "אני נותן לחברי הצוות שלי את החופש לבחור כיצד הם מבצעים את עבודתם.", en: "I give my team members the freedom to choose how they perform their work." },
  },
  {
    id: 2, category: 'autonomy', weight: -1,
    text: { he: "אני מרגיש לחוץ לעבוד בדרכים שלא נראות לי טבעיות.", en: "I feel pressured to work in unnatural ways." },
    managerText: { he: "אני מרגיש לחוץ לדחוף את הצוות שלי לעבוד בדרכים שלא מתאימות להם.", en: "I feel pressured to push my team to work in ways that don't suit them." },
  },
  {
    id: 3, category: 'autonomy', weight: 1,
    text: { he: "יש לי תחושת חופש ובחירה בתפקיד שלי.", en: "I feel freedom and choice in my role." },
    managerText: { he: "חברי הצוות שלי חופשיים לקחת אחריות ולקבל החלטות בתפקידם.", en: "My team members feel free to take ownership and make decisions in their roles." },
  },
  {
    id: 10, category: 'autonomy', weight: 1,
    text: { he: "אני מרגיש שיש לי השפעה על החלטות הנוגעות לעבודתי.", en: "I have influence over work decisions." },
    managerText: { he: "אני מערב באופן פעיל את הצוות שלי בהחלטות הנוגעות לעבודתם.", en: "I actively involve my team in decisions that affect their work." },
  },
  {
    id: 11, category: 'autonomy', weight: 1,
    text: { he: "דעתי נשמעת ונלקחת בחשבון על ידי הממונים עלי.", en: "My opinion is heard by superiors." },
    managerText: { he: "אני דואג שקולו של כל חבר צוות נשמע ונלקח ברצינות.", en: "I make sure every team member's voice is heard and genuinely considered." },
  },
  {
    id: 12, category: 'autonomy', weight: -1,
    text: { he: "אני מרגיש כבול על ידי נהלים נוקשים.", en: "I feel bound by rigid procedures." },
    managerText: { he: "הצוות שלי מרגיש כבול בנהלים ותהליכים שאני מאכף.", en: "My team feels constrained by the processes and procedures I enforce." },
  },
  // ── COMPETENCE ────────────────────────────────────────────────────────────
  {
    id: 4, category: 'competence', weight: 1,
    text: { he: "אני מרגיש בטוח ביכולת שלי לבצע את המשימות היטב.", en: "I am confident in my ability to perform well." },
    managerText: { he: "אני בטוח ביכולתי לאמן ולפתח את כישורי הצוות שלי.", en: "I am confident in my ability to coach and develop my team's skills." },
  },
  {
    id: 5, category: 'competence', weight: -1,
    text: { he: "לעיתים קרובות אני מרגיש לא כשיר לעמוד בדרישות.", en: "I often feel inadequate to meet demands." },
    managerText: { he: "לעיתים קרובות אני חושש שהצוות שלי חסר את הכישורים או התמיכה הנדרשים.", en: "I often worry my team lacks the skills or support needed to meet expectations." },
  },
  {
    id: 6, category: 'competence', weight: 1,
    text: { he: "יש לי הזדמנות להשתמש בכישורים הטובים ביותר שלי.", en: "I use my best skills every day." },
    managerText: { he: "אני יוצר הזדמנויות לכל חבר צוות להשתמש ביכולות החזקות שלו.", en: "I create opportunities for each team member to use their strongest abilities." },
  },
  {
    id: 13, category: 'competence', weight: 1,
    text: { he: "אני מרגיש שאני לומד ומתפתח מקצועית.", en: "I am learning and developing professionally." },
    managerText: { he: "אני משקיע באופן פעיל בלמידה ובצמיחה המקצועית של חברי הצוות שלי.", en: "I actively invest in my team members' professional learning and growth." },
  },
  {
    id: 14, category: 'competence', weight: 1,
    text: { he: "אני בטוח ביכולתי למצוא פתרון לאתגרים.", en: "I am confident finding solutions to challenges." },
    managerText: { he: "אני מאמן את הצוות שלי להתמודד עם אתגרים ולמצוא פתרונות בעצמם.", en: "I coach my team to tackle challenges and find their own solutions." },
  },
  {
    id: 15, category: 'competence', weight: -1,
    text: { he: "לפעמים אני חושש שאין לי את הכישורים הנדרשים.", en: "Sometimes I worry I lack necessary skills." },
    managerText: { he: "לפעמים אני חושש שאיני מספק לצוות שלי את ההכוונה הנכונה לצמיחתם.", en: "I sometimes worry I'm not providing my team with the right guidance to grow." },
  },
  // ── RELATEDNESS ───────────────────────────────────────────────────────────
  {
    id: 7, category: 'relatedness', weight: 1,
    text: { he: "אני מרגיש תחושת שייכות עם האנשים בעבודה.", en: "I feel a sense of belonging with colleagues." },
    managerText: { he: "אני בונה באופן פעיל תחושת שייכות וחיבור בקרב הצוות שלי.", en: "I actively build a sense of belonging and connection among my team." },
  },
  {
    id: 8, category: 'relatedness', weight: -1,
    text: { he: "אני מרגיש בודד או מבודד כשאני בעבודה.", en: "I feel lonely or isolated at work." },
    managerText: { he: "חלק מחברי הצוות נראים מנותקים או מבודדים מהשאר.", en: "Some team members appear disconnected or isolated from the rest of the group." },
  },
  {
    id: 9, category: 'relatedness', weight: 1,
    text: { he: "אני מרגיש שלאנשים שאני עובד איתם אכפת ממני.", en: "People I work with care about me." },
    managerText: { he: "אני מבהיר לכל חבר צוות שאכפת לי באמת מהרווחה שלו.", en: "I make it clear to each team member that I genuinely care about their wellbeing." },
  },
  {
    id: 16, category: 'relatedness', weight: 1,
    text: { he: "אני מרגיש בנוח לשתף את חבריי לצוות בקשיים.", en: "I feel comfortable sharing difficulties." },
    managerText: { he: "חברי הצוות שלי מרגישים בטוחים מבחינה נפשית לשתף אותי בבעיות וקשיים.", en: "My team members feel psychologically safe to share problems or struggles with me." },
  },
  {
    id: 17, category: 'relatedness', weight: 1,
    text: { he: "האווירה בצוות שלי היא תומכת וחברית.", en: "The team atmosphere is supportive." },
    managerText: { he: "אני מטפח אווירת צוות תומכת ושיתופית באמת.", en: "I nurture a team atmosphere that is genuinely supportive and collaborative." },
  },
  {
    id: 18, category: 'relatedness', weight: -1,
    text: { he: "אני מרגיש לעיתים שאני 'מחוץ לעניינים' חברתית.", en: "I sometimes feel socially 'out of the loop'." },
    managerText: { he: "אני שם לב כשחברי צוות נראים מחוץ לשיחות או החלטות חשובות.", en: "I notice when team members seem left out of important conversations or decisions." },
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. All 18 entries now satisfy the updated `Question` type.

- [ ] **Step 3: Commit**

```bash
git add constants.ts
git commit -m "feat(phase2): add manager-context question variants to all 18 questions (HE+EN)"
```

---

## Task 3: Render manager question text in `AssessmentView`

**Files:**
- Modify: `views/AssessmentView.tsx`

- [ ] **Step 1: Add `userRole` to the props interface and destructure it**

Open `views/AssessmentView.tsx`. At the top, add `UserRole` to the imports:

```ts
import { TranslationData, Answers, Language, UserRole } from '../types';
```

Extend `AssessmentViewProps`:

```ts
interface AssessmentViewProps {
  t: TranslationData;
  lang: Language;
  setLang: (lang: Language) => void;
  currentQuestionIndex: number;
  answers: Answers;
  onAnswer: (questionId: number, value: number) => void;
  onBack: () => void;
  userRole: UserRole;   // ← add this
}
```

Update the function signature:

```ts
const AssessmentView: React.FC<AssessmentViewProps> = ({
  t, lang, setLang, currentQuestionIndex, answers, onAnswer, onBack, userRole
}) => {
```

- [ ] **Step 2: Replace the hardcoded `q.text[lang]` with role-aware text**

Find the paragraph that renders the question text (currently line 57):

```tsx
<p className="text-2xl sm:text-3xl font-black leading-tight mb-8 sm:mb-12" style={{ color: 'var(--b2c-ink)' }}>{q.text[lang]}</p>
```

Replace it with:

```tsx
<p className="text-2xl sm:text-3xl font-black leading-tight mb-8 sm:mb-12" style={{ color: 'var(--b2c-ink)' }}>
  {userRole === 'manager' && q.managerText ? q.managerText[lang] : q.text[lang]}
</p>
```

- [ ] **Step 3: Fix the call site in `App.tsx`**

Open `App.tsx` and find where `AssessmentView` is rendered (search for `<AssessmentView`). Add the `userRole` prop:

```tsx
<AssessmentView
  t={t}
  lang={lang}
  setLang={setLang}
  currentQuestionIndex={currentQuestionIndex}
  answers={answers}
  onAnswer={handleAnswer}
  onBack={handleBack}
  userRole={userRole}    // ← add this line
/>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Smoke-test in dev server**

```bash
npm run dev
```

Open `http://localhost:5173`. In demo mode:
- Click **"חיובי"** (or any demo) → go through assessment as **Solo** → confirm Q1 reads "I can choose how to perform my work."
- Reset → switch role to **Manager** at role-select → confirm Q1 reads "I give my team members the freedom to choose how they perform their work."

- [ ] **Step 6: Commit**

```bash
git add views/AssessmentView.tsx App.tsx
git commit -m "feat(phase2): render managerText in AssessmentView when userRole is manager"
```

---

## Task 4: Add `questionVariant` to the webhook submission

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Add `questionVariant` to the submission `syncData` call**

In `App.tsx`, find `syncData('submission', ...)` (around line 316):

```ts
syncData('submission', { answers: data, results: calculatedResults, insights: insightsSummary });
```

Replace with:

```ts
syncData('submission', {
  answers: data,
  results: calculatedResults,
  insights: insightsSummary,
  questionVariant: userRole === 'manager' ? 'manager' : 'employee',
});
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add App.tsx
git commit -m "feat(phase2): add questionVariant field to webhook submission payload"
```

---

## Task 5: Build verification + PR

- [ ] **Step 1: Full production build**

```bash
npm run build
```

Expected: exits 0, `dist/` folder produced, no TypeScript or Vite errors.

- [ ] **Step 2: Manual regression — solo path**

```bash
npm run preview
```

Open `http://localhost:4173`. 
1. Clear localStorage (`Application → Local Storage → Clear`).
2. Use demo high path as **Solo Contributor**.
3. Walk all 18 questions — every question should use `text[lang]` (employee phrasing).
4. Complete assessment — analysis shows "Personal Insights" panel.
5. DevTools Network tab (or `copy_report` interaction event): `questionVariant` = `"employee"`.

- [ ] **Step 3: Manual regression — manager path**

1. Reset (start fresh).
2. Choose **Manager** at role-select.
3. Walk through questions — confirm Q1 reads the manager variant, Q2 reads the manager variant, etc.
4. Complete assessment — analysis shows "Manager Recommendations" panel.
5. DevTools: `questionVariant` = `"manager"`.

- [ ] **Step 4: Fallback check**

Temporarily comment out `managerText` from one question in `constants.ts`, run as Manager — confirm that question falls back to `text[lang]` with no crash. Restore the line.

- [ ] **Step 5: Create PR**

```bash
git push -u origin feat/phase1-launch-config
```

(Branch is already tracking origin — just push the new commits.)

Then open a PR via `gh`:

```bash
gh pr create --base master \
  --title "feat(phase2): manager-context question variants for all 18 SDT questions" \
  --body "$(cat <<'EOF'
## Summary

- Adds optional \`managerText\` field to \`Question\` type
- Authors manager-reframed variants of all 18 SDT questions in Hebrew and English (subject → team, verb → managerial action, SDT factor + polarity preserved)
- \`AssessmentView\` selects \`managerText[lang]\` when \`userRole === 'manager'\` and the field is present; falls back to \`text[lang]\` otherwise
- Adds \`questionVariant: 'manager' | 'employee'\` to the webhook submission payload for analytics segmentation

## Test plan

- [ ] Solo path: all 18 questions show employee phrasing
- [ ] Manager path: all 18 questions show manager phrasing
- [ ] Fallback: removing \`managerText\` from one question falls back gracefully
- [ ] Webhook payload includes \`questionVariant\`
- [ ] \`npm run build\` exits 0

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Spec coverage self-check

| Spec requirement | Covered by |
|---|---|
| `managerText?: LocalizedText` on `Question` | Task 1 |
| Populate `managerText` on all 18 questions, HE+EN | Task 2 |
| Authoring rubric: subject = team, verb = manager action, factor + polarity preserved | Task 2 (content) |
| `AssessmentView` picks `managerText` when manager + field present | Task 3 |
| Falls back to `text[lang]` when `managerText` absent | Task 3 (ternary) |
| `questionVariant` in `syncData` submission | Task 4 |
| Identical scores under both roles for identical answers | Inherent — only display text changes, weight/scoring unchanged |

**Deferred items** (not in this plan, per spec):
- Category preview at section boundaries
- Per-question micro-explainer toggle
- Optional 9-question short version
