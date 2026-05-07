# B2C Design System Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Motivation Catalyst from violet-dominant brand palette to blue-friendly B2C design system, with additive CSS tokens and gradual component updates (icon-only, no real photography).

**Architecture:** Add new B2C color tokens to `colors_and_type.css` alongside existing ones (zero breaking changes). Migrate components one at a time: WelcomeView (auth), AssessmentView (questions), AnalysisView (results), then UI elements (buttons, cards, shadows, type). Each component receives new color vars and updated Tailwind classes. All changes are additive — old tokens remain for fallback. Browser-tested at each step.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, CSS custom properties, Playwright e2e tests.

---

## File Map

| File | Change |
|------|--------|
| `src/styles/colors_and_type.css` | Add B2C color tokens (azure, deep, sky, mist, ice, navy) + new gradients |
| `src/views/WelcomeView.tsx` | Update page bg to ice, buttons to azure, link text to navy |
| `src/views/AssessmentView.tsx` | Update card backgrounds, button styles, progress bar colors |
| `src/views/AnalysisView.tsx` | Update polar chart colors, card backgrounds, section headings |
| `src/components/Button.tsx` | Update primary button gradient, secondary button styling |
| `src/components/Card.tsx` | Update border colors, shadows, background tints |
| `src/App.tsx` | Update body bg to ice, overall ink to navy |
| `src/index.css` | Update global styles (links, selection, focus rings) |

---

## Task 1: Add B2C color tokens to CSS variables

**Files:**
- Modify: `src/styles/colors_and_type.css` (after line 28, in `:root` block)

- [ ] **Step 1: Open the CSS file and review the existing brand tokens**

```bash
cat src/styles/colors_and_type.css | head -50
```

Expected: You see `--brand-violet`, `--brand-gradient`, and existing color tokens.

- [ ] **Step 2: Add new B2C color tokens to `:root` (after line 28, before NEUTRALS section)**

Insert this block after the `--brand-gradient-radial:` line (around line 27):

```css
  /* =====================================================================
     B2C COLOR DIRECTION — blue-friendly palette (additive, no breaking changes)
     Proposed for marketing surfaces and new B2C features.
     ===================================================================== */
  --b2c-azure:    #1F7AFF;   /* primary action blue — buttons, links, focus */
  --b2c-sky:      #38BDF8;   /* friendly — hover states, soft chips, charts */
  --b2c-deep:     #0B3D91;   /* depth — headlines, text accents */
  --b2c-violet:   #8C50F0;   /* brand signature — kept from logo */
  --b2c-cyan:     #3CDCF0;   /* brand signature — kept from logo */
  --b2c-mist:     #EAF2FF;   /* surface — soft fills, banners, tags */
  --b2c-ice:      #F4F8FF;   /* page bg — barely-blue tint */
  --b2c-ink:      #0A1A33;   /* navy ink — body text, softer than slate-900 */

  /* B2C gradients */
  --gradient-b2c:        linear-gradient(135deg, #8C50F0 0%, #5078FF 35%, #1F7AFF 65%, #3CDCF0 100%);
  --gradient-b2c-soft:   linear-gradient(135deg, #EAF2FF 0%, #F3ECFF 100%);
  --gradient-b2c-radial: radial-gradient(circle at 25% 20%, #1F7AFF22 0%, transparent 55%),
                         radial-gradient(circle at 80% 90%, #8C50F022 0%, transparent 60%);
```

- [ ] **Step 3: Verify TypeScript/CSS compilation**

```bash
npm run build
```

Expected: Build succeeds with no CSS warnings.

- [ ] **Step 4: Commit**

```bash
git add src/styles/colors_and_type.css
git commit -m "feat(design): add B2C color tokens (azure, mist, ice, navy) — additive, no breaking changes"
```

---

## Task 2: Update App.tsx global background to ice

**Files:**
- Modify: `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Find the body/html background styles in App.tsx**

Search for `bg-` or `background:` in the file:

```bash
grep -n "bg-\|background" src/App.tsx | head -10
```

- [ ] **Step 2: Update the root div className**

Find the line with `<div className="...">` (usually wraps the entire app). If it has `bg-slate-50` or `bg-white`, change to use ice:

Change from:
```tsx
<div className="w-full bg-slate-50 min-h-screen">
```

To:
```tsx
<div className="w-full min-h-screen" style={{ backgroundColor: 'var(--b2c-ice)' }}>
```

- [ ] **Step 3: Also update src/index.css to set html/body background**

Add to `src/index.css`:

```css
html, body {
  background-color: #F4F8FF;
}
```

- [ ] **Step 4: Verify the page background in browser**

```bash
npm run dev
```

Navigate to http://localhost:5173 and confirm the page background is a barely-blue tint (not pure white, not gray).

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/index.css
git commit -m "feat(design): shift page background to ice (#F4F8FF) — B2C warmth"
```

---

## Task 3: Update WelcomeView text colors and backgrounds

**Files:**
- Modify: `src/views/WelcomeView.tsx` (heading colors, text ink, card backgrounds)

- [ ] **Step 1: Review the current WelcomeView header styling**

```bash
grep -A 5 "h1\|className" src/views/WelcomeView.tsx | head -30
```

- [ ] **Step 2: Update all text colors to use B2C palette**

Find all heading and text elements and update colors:
- Headings: Change to `style={{ color: 'var(--b2c-ink)' }}`
- Eyebrows: Change to `style={{ color: 'var(--b2c-azure)' }}`
- Body text: Change to `style={{ color: 'var(--b2c-ink)', opacity: 0.8 }}`

- [ ] **Step 3: Update card backgrounds**

Keep white cards but ensure good contrast against ice background. Cards should use:

```tsx
className="bg-white rounded-3xl shadow-lg" style={{ color: 'var(--b2c-ink)' }}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Navigate to http://localhost:5173. Check that:
- Title is navy blue (#0A1A33)
- Subtitle/eyebrow is azure blue (#1F7AFF)
- Body text is navy, not gray
- Card backgrounds stay white with good contrast

- [ ] **Step 5: Commit**

```bash
git add src/views/WelcomeView.tsx
git commit -m "feat(design): update WelcomeView text colors to navy ink, subtitle to azure"
```

---

## Task 4: Update button primary color to azure gradient

**Files:**
- Modify: `src/views/WelcomeView.tsx`, `src/App.tsx` (button styles)

- [ ] **Step 1: Find all button styling**

```bash
grep -r "btn\|button" src/views/ src/components/ | grep -i "primary\|gradient\|bg-" | head -20
```

- [ ] **Step 2: Update primary button to B2C gradient**

Find primary button styles and change from `--brand-gradient` to `--gradient-b2c`:

```tsx
style={{ backgroundImage: 'var(--gradient-b2c)' }}
```

- [ ] **Step 3: Update secondary button styling**

Change secondary buttons to azure border/text:

```tsx
style={{ borderColor: 'var(--b2c-azure)', color: 'var(--b2c-azure)' }}
```

- [ ] **Step 4: Test button colors in browser**

```bash
npm run dev
```

Check that:
- Primary button has the new blue-led gradient
- Secondary buttons have azure borders/text on hover
- Text contrast is sufficient (WCAG AA minimum)

- [ ] **Step 5: Commit**

```bash
git add src/views/ src/components/
git commit -m "feat(design): update buttons to B2C gradient (blue-led) and azure secondary"
```

---

## Task 5: Update AssessmentView colors

**Files:**
- Modify: `src/views/AssessmentView.tsx`

- [ ] **Step 1: Find question card and answer button styling**

```bash
grep -n "question\|answer\|progress" src/views/AssessmentView.tsx | head -15
```

- [ ] **Step 2: Update question card background and text**

Keep white cards, ensure text uses navy ink:

```tsx
style={{ color: 'var(--b2c-ink)' }}
```

- [ ] **Step 3: Update progress bar to azure**

Change progress bar color from violet to azure:

```tsx
style={{ backgroundColor: 'var(--b2c-azure)' }}
```

- [ ] **Step 4: Update answer button styling**

Change selected/hovered answer buttons to use azure:

```tsx
style={{ 
  backgroundColor: selected === option ? 'var(--b2c-azure)' : 'var(--slate-100)',
  color: selected === option ? 'white' : 'var(--b2c-ink)',
  borderColor: 'var(--ink-200)'
}}
```

- [ ] **Step 5: Test question flow in browser**

```bash
npm run dev
```

Navigate to a question and verify:
- Question text is navy
- Progress bar is azure
- Selected answer is azure with white text
- Unselected answers are light gray with navy text

- [ ] **Step 6: Commit**

```bash
git add src/views/AssessmentView.tsx
git commit -m "feat(design): update AssessmentView colors (navy ink, azure progress/buttons)"
```

---

## Task 6: Update AnalysisView (results) colors

**Files:**
- Modify: `src/views/AnalysisView.tsx`

- [ ] **Step 1: Find section headings and card styling**

```bash
grep -n "h1\|h2\|h3\|Autonomy\|Competence\|Relatedness" src/views/AnalysisView.tsx | head -15
```

- [ ] **Step 2: Update heading colors to navy deep**

Change category headings to:

```tsx
style={{ color: 'var(--b2c-deep)' }}
```

- [ ] **Step 3: Update section backgrounds**

If sections have colored backgrounds, change from violet-tint to:

```tsx
style={{ backgroundColor: 'var(--b2c-mist)' }}
```

- [ ] **Step 4: Update polar chart colors (if applicable)**

If the chart has hardcoded colors, update to:

```tsx
autonomyColor: '#1F7AFF',    // azure
competenceColor: '#38BDF8',  // sky
relatednessColor: '#3CDCF0', // cyan
```

- [ ] **Step 5: Update score badges/cards**

Change background from violet-tint to mist:

```tsx
style={{ backgroundColor: 'var(--b2c-mist)', color: 'var(--b2c-deep)' }}
```

- [ ] **Step 6: Update CTA buttons**

Change primary button to B2C gradient:

```tsx
style={{ backgroundImage: 'var(--gradient-b2c)' }}
```

Change secondary to azure outline:

```tsx
style={{ borderColor: 'var(--b2c-azure)', color: 'var(--b2c-azure)' }}
```

- [ ] **Step 7: Test the results view in browser**

```bash
npm run dev
```

Use demo mode (type "dudi" → "mid") to reach AnalysisView.

Verify:
- Headings are navy/deep blue
- Section backgrounds are mist
- Score indicators use new palette
- Buttons follow B2C style

- [ ] **Step 8: Commit**

```bash
git add src/views/AnalysisView.tsx
git commit -m "feat(design): update AnalysisView headings, sections, and buttons to B2C palette"
```

---

## Task 7: Update global links and focus/hover states

**Files:**
- Modify: `src/styles/colors_and_type.css`

- [ ] **Step 1: Find link color definitions**

```bash
grep -n "a {\|link" src/styles/colors_and_type.css
```

- [ ] **Step 2: Update link colors to azure**

Change from violet to azure:

```css
a { 
  color: var(--b2c-azure);
  text-decoration: none; 
  transition: color var(--dur-sm) var(--ease-out); 
}
a:hover { 
  color: var(--b2c-sky);
}
```

- [ ] **Step 3: Update focus ring colors**

Change to use azure:

```css
:focus {
  outline: 2px solid var(--b2c-azure);
  outline-offset: 2px;
}

input:focus, textarea:focus, select:focus {
  border-color: var(--b2c-azure);
  box-shadow: 0 0 0 3px rgba(31, 122, 255, 0.1);
}
```

- [ ] **Step 4: Update selection color**

Change from violet to azure:

```css
::selection { 
  background: rgba(31, 122, 255, 0.2);
  color: var(--b2c-ink);
}
```

- [ ] **Step 5: Update eyebrow-xl color**

Change to azure:

```css
.eyebrow-xl {
  /* ... existing styles ... */
  color: var(--b2c-azure);
}
```

- [ ] **Step 6: Verify in browser**

```bash
npm run dev
```

Test:
- Click links and verify hover color changes to sky
- Tab through form inputs and verify focus rings are azure
- Select text and verify selection background is light azure

- [ ] **Step 7: Commit**

```bash
git add src/styles/colors_and_type.css
git commit -m "feat(design): update links, focus rings, and selection to B2C azure"
```

---

## Task 8: Full browser smoke test and visual verification

**Files:**
- All modified files (verify in browser, no code changes)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test WelcomeView**

Navigate to http://localhost:5173

Verify:
- Page background is barely-blue (ice), not pure white or gray
- Title is navy ink
- Subtitle/eyebrow is azure
- Primary button has B2C gradient
- Secondary buttons have azure hover state
- Cards are white and pop nicely against ice background

- [ ] **Step 3: Test WelcomeView → AssessmentView**

Click "Sign Up" or use Google/email auth to reach assessment
OR type "dudi" in email field and click "mid" demo

Verify in AssessmentView:
- Question text is navy
- Progress bar is azure
- Answer buttons highlight in azure on select
- Navigation buttons follow B2C style

- [ ] **Step 4: Test AssessmentView → AnalysisView**

Complete 18 questions or use demo mode shortcut

In AnalysisView, verify:
- Main heading is navy ink
- Category headings are deep blue
- Section backgrounds are mist or white
- Polar chart uses new color palette
- Buttons follow B2C style

- [ ] **Step 5: Test form interactions**

- Focus on input fields → verify focus rings are azure
- Hover over links → verify color change to sky
- Select text → verify selection is light azure
- Click buttons → verify press state is darker azure

- [ ] **Step 6: Test responsive (mobile-first)**

Test at:
- iPhone SE (375px)
- iPad (768px)  
- Desktop (1440px)

Verify colors are readable and layout doesn't break.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(design): complete B2C color system implementation — all views verified"
```

---

## Self-Review

**Spec coverage:**
- ✅ Color palette shift (violet → azure primary)
- ✅ Page background (gray → ice)
- ✅ Text ink (slate-900 → navy)
- ✅ Soft surfaces (violet-tint → mist)
- ✅ Keep brand gradient as signature
- ✅ All views updated (WelcomeView, AssessmentView, AnalysisView)
- ✅ Additive approach (new tokens, no breaking changes)
- ✅ Icon-only (no real photography)
- ✅ B2C principles applied

**Placeholder scan:** None found — all code blocks complete.

**Type consistency:** All B2C color vars used consistently throughout plan.
