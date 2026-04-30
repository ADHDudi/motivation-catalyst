# Auth — Email Sign In, Sign Up & Forgot Password Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up Firebase email/password Sign In, Sign Up, and Forgot Password flows — replacing all three no-op stubs in WelcomeView with real Firebase Auth calls and user-facing feedback.

**Architecture:** All Firebase auth calls live in `authUtils.ts`. `WelcomeView` gains a local `authMode` state (`'signin' | 'signup' | 'forgot'`) that swaps form fields and submit behaviour without leaving the page. `App.tsx` receives three new callbacks and surfaces auth errors via a shared `authError` state.

**Tech Stack:** React 19, TypeScript, Firebase Auth compat SDK (v10, loaded via CDN in `index.html`), Playwright for tests.

---

## File Map

| File | Change |
|------|--------|
| `authUtils.ts` | Add `signInWithEmail`, `signUpWithEmail`, `sendPasswordReset` |
| `views/WelcomeView.tsx` | Add `authMode` state, conditional form fields, error display, new prop handlers |
| `App.tsx` | Wire new auth callbacks, add `authError` state passed to WelcomeView |
| `tests/auth.spec.ts` | Activate `test.fixme` blocks (UC-AUTH-10 → 16), add sign-in password tests |

---

## Task 1: Add Firebase auth functions to `authUtils.ts`

**Files:**
- Modify: `authUtils.ts`

- [ ] **Step 1: Add `signInWithEmail`**

Replace the current contents of `authUtils.ts` with:

```typescript
const isFirebaseReady = () => window.firebase?.apps?.length > 0;

export const signInWithGoogle = async (): Promise<any> => {
    if (!isFirebaseReady()) { console.error('Firebase not initialized'); return null; }
    try {
        const provider = new window.firebase.auth.GoogleAuthProvider();
        const result = await window.firebase.auth().signInWithPopup(provider);
        return result.user;
    } catch (error) {
        console.error('Error signing in with Google', error);
        throw error;
    }
};

export const signOutUser = async (): Promise<void> => {
    if (!isFirebaseReady()) return;
    try { await window.firebase.auth().signOut(); }
    catch (error) { console.error('Error signing out', error); throw error; }
};

export const onAuthStateChange = (callback: (user: any) => void) => {
    if (!isFirebaseReady()) return () => {};
    return window.firebase.auth().onAuthStateChanged(callback);
};

/** Sign in an existing user with email + password. Throws on wrong credentials. */
export const signInWithEmail = async (email: string, password: string): Promise<any> => {
    if (!isFirebaseReady()) throw new Error('Firebase not initialized');
    const result = await window.firebase.auth().signInWithEmailAndPassword(email, password);
    return result.user;
};

/** Register a new user with email + password. Throws on duplicate / weak password. */
export const signUpWithEmail = async (email: string, password: string): Promise<any> => {
    if (!isFirebaseReady()) throw new Error('Firebase not initialized');
    const result = await window.firebase.auth().createUserWithEmailAndPassword(email, password);
    return result.user;
};

/** Send a password-reset email. Throws if email is not registered. */
export const sendPasswordReset = async (email: string): Promise<void> => {
    if (!isFirebaseReady()) throw new Error('Firebase not initialized');
    await window.firebase.auth().sendPasswordResetEmail(email);
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add authUtils.ts
git commit -m "feat(auth): add signInWithEmail, signUpWithEmail, sendPasswordReset to authUtils"
```

---

## Task 2: Add auth mode state & UI to `WelcomeView`

**Files:**
- Modify: `views/WelcomeView.tsx`

The view needs to support three modes rendered inside the same card:
- `signin` — email + password → "Sign In" submit
- `signup` — email + password + confirm-password → "Create Account" submit
- `forgot` — email only → "Send Reset Link" submit

Each mode shows a friendly error string beneath the inputs if `authError` is set.

- [ ] **Step 1: Update the `WelcomeViewProps` interface**

At the top of `views/WelcomeView.tsx`, change the interface to:

```typescript
interface WelcomeViewProps {
  t: TranslationData;
  lang: Language;
  setLang: (lang: Language) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onStart: (e: React.FormEvent) => void;
  onDemo: (type: 'high' | 'mid' | 'at-risk') => void;
  onGoogleLogin: () => void;
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  onEmailSignUp: (email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  authError: string | null;
  authSuccess: string | null;
}
```

- [ ] **Step 2: Rewrite the component body**

Replace the entire component function with the following. The existing marketing sections (pain, solution, value) are kept unchanged — only the form area changes.

```typescript
const WelcomeView: React.FC<WelcomeViewProps> = ({
  t, lang, setLang, formData, setFormData,
  onStart, onDemo, onGoogleLogin,
  onEmailSignIn, onEmailSignUp, onForgotPassword,
  authError, authSuccess,
}) => {
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup' | 'forgot'>('signin');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [localError, setLocalError] = React.useState<string | null>(null);

  const googleBtnText = lang === 'he' ? 'התחבר עם גוגל' : 'Sign in with Google';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (authMode === 'signin') {
      await onEmailSignIn(formData.employeeEmail, password);
    } else if (authMode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError(lang === 'he' ? 'הסיסמאות אינן תואמות' : 'Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setLocalError(lang === 'he' ? 'הסיסמה חייבת להכיל לפחות 6 תווים' : 'Password must be at least 6 characters');
        return;
      }
      await onEmailSignUp(formData.employeeEmail, password);
    } else {
      await onForgotPassword(formData.employeeEmail);
    }
  };

  const displayError = localError || authError;

  const submitLabel = {
    signin: lang === 'he' ? 'התחבר' : 'Sign In',
    signup: lang === 'he' ? 'צור חשבון' : 'Create Account',
    forgot: lang === 'he' ? 'שלח קישור איפוס' : 'Send Reset Link',
  }[authMode];

  return (
    <div className={`w-full max-w-lg mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[100dvh] md:min-h-0 text-${t.dir === 'rtl' ? 'right' : 'left'}`} dir={t.dir}>
      <div className={`p-8 pt-12 text-center relative bg-white overflow-hidden text-slate-900`}>
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#90BC6E]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#D9618E]/5 rounded-full blur-3xl" />
        <div className="flex justify-between items-center mb-10 relative z-10">
          <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} className="bg-slate-50 text-slate-400 p-3 rounded-2xl text-[10px] font-black transition-all active:scale-90">
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
          <Logo size="sm" />
        </div>
        <div className="relative inline-block mb-6 z-10">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl border-4 border-[#324FA2]/5">
            <Beaker size={48} className="text-[#78A9D6]" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#90BC6E] rounded-full border-4 border-white shadow-lg" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#324FA2] leading-tight mb-2">{t.title}</h1>
        <div className="inline-block px-4 py-1 bg-[#E46B3F]/10 rounded-full">
          <p className="text-[#E46B3F] text-xs font-black uppercase tracking-widest">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 px-8 pb-12 relative z-10 overflow-y-auto">
        {/* Marketing sections — only show on signin mode to keep signup/forgot clean */}
        {authMode === 'signin' && (
          <>
            <div className="mb-8 p-6 bg-gradient-to-br from-[#E46B3F]/5 to-[#D9618E]/5 rounded-[30px] border-2 border-[#D9618E]/10 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle size={20} className="text-[#D9618E]" />
                <h3 className="font-black text-lg text-[#324FA2]">{t.painTitle}</h3>
              </div>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">{t.painText}</p>
            </div>
            <div className="mb-8 p-6 bg-[#78A9D6]/5 rounded-[30px] border-2 border-[#78A9D6]/20 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={20} className="text-[#324FA2]" />
                <h3 className="font-black text-lg text-[#324FA2]">{t.solutionTitle}</h3>
              </div>
              <p className="text-sm text-slate-600 font-bold opacity-80 leading-relaxed">{t.solutionText}</p>
            </div>
            <div className="mb-10 p-6 bg-[#90BC6E]/5 rounded-[30px] border-2 border-[#90BC6E]/10 shadow-sm">
              <h3 className="font-black text-lg text-[#324FA2] mb-4 flex items-center gap-3">
                <Target size={20} className="text-[#90BC6E]" /> {t.valueTitle}
              </h3>
              <ul className="space-y-3">
                {t.valueList.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600 font-bold leading-tight">
                    <Zap size={14} className="text-[#E46B3F] shrink-0 mt-1" />{String(item)}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Mode heading for signup / forgot */}
        {authMode !== 'signin' && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-[#324FA2] mb-2">
              {authMode === 'signup'
                ? (lang === 'he' ? 'יצירת חשבון חדש' : 'Create an Account')
                : (lang === 'he' ? 'איפוס סיסמה' : 'Reset Password')}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {authMode === 'signup'
                ? (lang === 'he' ? 'הירשם כדי לשמור את התוצאות שלך' : 'Sign up to save your results')
                : (lang === 'he' ? 'נשלח קישור לאיפוס הסיסמה לכתובת המייל שלך' : "We'll send a reset link to your email")}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-[95%] mx-auto block space-y-0 relative z-10">
          {/* Google button only on sign-in mode */}
          {authMode === 'signin' && (
            <>
              <button
                type="button"
                onClick={onGoogleLogin}
                className="w-full bg-white text-[#334155] font-bold text-[15px] tracking-wide py-3.5 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-300 transition-all mb-8"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-[18px] h-[18px]" alt="Google Icon" />
                {googleBtnText}
              </button>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-slate-200/60"></div>
                <span className="text-[#94A3B8] text-[11px] font-black uppercase tracking-wider text-center">{lang === 'he' ? 'או' : 'OR'}</span>
                <div className="flex-1 h-px bg-slate-200/60"></div>
              </div>
            </>
          )}

          {/* Shared fields */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder={lang === 'he' ? 'כתובת אימייל' : 'Email address'}
              className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 outline-none transition-all placeholder:text-[#94A3B8] placeholder:font-medium font-medium focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
              value={formData.employeeEmail}
              onChange={e => setFormData({ ...formData, employeeName: e.target.value.split('@')[0], employeeEmail: e.target.value })}
              required
            />

            {/* Password — shown on signin and signup, hidden on forgot */}
            {authMode !== 'forgot' && (
              <input
                type="password"
                placeholder={lang === 'he' ? 'סיסמה' : 'Password'}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 outline-none transition-all placeholder:text-[#94A3B8] placeholder:font-medium font-medium focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            )}

            {/* Confirm password — signup only */}
            {authMode === 'signup' && (
              <input
                type="password"
                placeholder={lang === 'he' ? 'אימות סיסמה' : 'Confirm password'}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 outline-none transition-all placeholder:text-[#94A3B8] placeholder:font-medium font-medium focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            )}
          </div>

          {/* Error message */}
          {displayError && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold" role="alert">
              {displayError}
            </div>
          )}

          {/* Success message (e.g. "Reset email sent") */}
          {authSuccess && (
            <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-bold" role="status">
              {authSuccess}
            </div>
          )}

          {/* Forgot password link — signin mode only */}
          {authMode === 'signin' && (
            <div className="flex justify-end pt-4 pb-6">
              <button
                type="button"
                onClick={() => { setAuthMode('forgot'); setLocalError(null); }}
                className="text-[#94A3B8] text-[13px] font-bold hover:text-slate-500 transition-colors"
              >
                {lang === 'he' ? 'שכחת סיסמה?' : 'Forgot Password?'}
              </button>
            </div>
          )}

          {authMode !== 'signin' && <div className="pt-6" />}

          {/* Primary submit */}
          <button
            type="submit"
            className="w-full bg-[#111827] text-white font-bold text-[15px] py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] hover:bg-black hover:shadow-lg transition-all mb-8"
          >
            {submitLabel}
          </button>

          {/* Mode switcher footer */}
          <div className="text-center">
            {authMode === 'signin' && (
              <>
                <span className="text-[#94A3B8] text-[14px] font-medium">{lang === 'he' ? 'אין לך חשבון? ' : "Don't have an account? "}</span>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setLocalError(null); }}
                  className="text-[#8B5CF6] text-[14px] font-bold hover:text-[#7C3AED] transition-colors ml-1"
                >
                  {lang === 'he' ? 'הרשם' : 'Sign up'}
                </button>
              </>
            )}
            {authMode !== 'signin' && (
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setLocalError(null); }}
                className="text-[#94A3B8] text-[14px] font-bold hover:text-slate-500 transition-colors"
              >
                {lang === 'he' ? '← חזור להתחברות' : '← Back to Sign In'}
              </button>
            )}
          </div>
        </form>

        {/* Dev demo panel */}
        {formData.employeeName.toLowerCase() === 'dudi' && (
          <div className="mt-12 p-6 bg-slate-50 rounded-[30px] border-4 border-dashed border-slate-200 flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">DEMO MODE</span>
            <div className="flex gap-4">
              {['high', 'mid', 'at-risk'].map(m => (
                <button key={m} onClick={() => onDemo(m as any)} className="px-4 py-2 bg-white rounded-full text-[10px] font-black text-[#324FA2] border border-slate-100 active:scale-95 uppercase">{m}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: errors only from App.tsx (new props not yet wired up).

- [ ] **Step 4: Commit**

```bash
git add views/WelcomeView.tsx
git commit -m "feat(auth): add authMode state (signin/signup/forgot) and form UI to WelcomeView"
```

---

## Task 3: Wire new auth callbacks in `App.tsx`

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Add imports at the top of `App.tsx`**

Add the three new imports to the existing import line from `./authUtils`:

```typescript
import { signInWithGoogle, onAuthStateChange, signInWithEmail, signUpWithEmail, sendPasswordReset } from './authUtils';
```

- [ ] **Step 2: Add auth state to the App component**

Inside the `App` component body, after the existing `useState` declarations, add:

```typescript
const [authError, setAuthError] = useState<string | null>(null);
const [authSuccess, setAuthSuccess] = useState<string | null>(null);
```

- [ ] **Step 3: Add the three handler functions**

After the existing `handleGoogleLogin` function, add:

```typescript
const handleEmailSignIn = async (email: string, password: string) => {
  setAuthError(null);
  try {
    const user = await signInWithEmail(email, password);
    if (user) {
      setFormData(prev => ({
        ...prev,
        employeeName: user.displayName || prev.employeeName,
        employeeEmail: user.email || prev.employeeEmail,
      }));
      setStep('assessment');
      setCurrentQuestionIndex(0);
    }
  } catch (error: any) {
    const code = error?.code || '';
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      setAuthError(lang === 'he' ? 'אימייל או סיסמה שגויים' : 'Invalid email or password');
    } else if (code === 'auth/too-many-requests') {
      setAuthError(lang === 'he' ? 'יותר מדי ניסיונות. נסה שוב מאוחר יותר' : 'Too many attempts. Try again later');
    } else {
      setAuthError(lang === 'he' ? 'שגיאת התחברות. נסה שוב' : 'Sign in failed. Please try again');
    }
  }
};

const handleEmailSignUp = async (email: string, password: string) => {
  setAuthError(null);
  try {
    const user = await signUpWithEmail(email, password);
    if (user) {
      setFormData(prev => ({
        ...prev,
        employeeName: user.displayName || prev.employeeName,
        employeeEmail: user.email || prev.employeeEmail,
      }));
      setStep('assessment');
      setCurrentQuestionIndex(0);
    }
  } catch (error: any) {
    const code = error?.code || '';
    if (code === 'auth/email-already-in-use') {
      setAuthError(lang === 'he' ? 'כתובת האימייל כבר רשומה במערכת' : 'Email already in use. Try signing in instead');
    } else if (code === 'auth/weak-password') {
      setAuthError(lang === 'he' ? 'הסיסמה חלשה מדי (מינימום 6 תווים)' : 'Password is too weak (min 6 characters)');
    } else {
      setAuthError(lang === 'he' ? 'הרשמה נכשלה. נסה שוב' : 'Sign up failed. Please try again');
    }
  }
};

const handleForgotPassword = async (email: string) => {
  setAuthError(null);
  setAuthSuccess(null);
  try {
    await sendPasswordReset(email);
    setAuthSuccess(lang === 'he' ? 'קישור לאיפוס סיסמה נשלח לאימייל שלך' : 'Password reset link sent — check your inbox');
  } catch (error: any) {
    const code = error?.code || '';
    if (code === 'auth/user-not-found') {
      setAuthError(lang === 'he' ? 'לא נמצא חשבון עם כתובת האימייל הזו' : 'No account found with this email');
    } else {
      setAuthError(lang === 'he' ? 'שליחה נכשלה. בדוק את האימייל ונסה שוב' : 'Failed to send. Check the email and try again');
    }
  }
};
```

- [ ] **Step 4: Update `handleStart` to clear auth errors**

In the existing `handleStart` function, add `setAuthError(null); setAuthSuccess(null);` at the start:

```typescript
const handleStart = (e: React.FormEvent) => {
  e.preventDefault();
  setAuthError(null);
  setAuthSuccess(null);
  if (!formData.employeeName) return;
  setStep('assessment');
  setCurrentQuestionIndex(0);
};
```

- [ ] **Step 5: Pass new props to `<WelcomeView>`**

In the JSX return, update the `<WelcomeView>` usage to include all new props:

```tsx
{step === 'welcome' && (
  <WelcomeView
    t={t}
    lang={lang}
    setLang={setLang}
    formData={formData}
    setFormData={setFormData}
    onStart={handleStart}
    onDemo={handleDemo}
    onGoogleLogin={handleGoogleLogin}
    onEmailSignIn={handleEmailSignIn}
    onEmailSignUp={handleEmailSignUp}
    onForgotPassword={handleForgotPassword}
    authError={authError}
    authSuccess={authSuccess}
  />
)}
```

- [ ] **Step 6: Verify TypeScript compiles with zero errors**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add App.tsx
git commit -m "feat(auth): wire email sign-in, sign-up, and forgot-password handlers in App"
```

---

## Task 4: Activate and complete the Playwright auth tests

**Files:**
- Modify: `tests/auth.spec.ts`

- [ ] **Step 1: Replace `test.fixme` blocks with real test implementations**

Replace UC-AUTH-10 through UC-AUTH-16 in `tests/auth.spec.ts`:

```typescript
// ─── SIGN UP ─────────────────────────────────────────────────────────────

test('UC-AUTH-10 | Sign Up — clicking Sign Up shows the signup form', async ({ page }) => {
  await page.getByRole('button', { name: 'הרשם' }).click();
  await expect(page.getByRole('heading', { name: /יצירת חשבון חדש|Create an Account/i })).toBeVisible();
  await expect(page.locator('input[placeholder*="אימות סיסמה"], input[placeholder*="Confirm"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toContainText(/צור חשבון|Create Account/);
});

test('UC-AUTH-11 | Sign Up — back link returns to sign-in form', async ({ page }) => {
  await page.getByRole('button', { name: 'הרשם' }).click();
  await expect(page.getByRole('heading', { name: /יצירת חשבון|Create an Account/i })).toBeVisible();
  await page.getByRole('button', { name: /חזור להתחברות|Back to Sign In/i }).click();
  await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).toBeVisible();
  await expect(page.getByRole('button', { name: /התחבר עם גוגל|Sign in with Google/i })).toBeVisible();
});

test('UC-AUTH-12 | Sign Up fail — mismatched passwords shows error', async ({ page }) => {
  await page.getByRole('button', { name: 'הרשם' }).click();
  await page.locator('input[type="email"]').fill('newuser@test.com');
  await page.locator('input[type="password"]').nth(0).fill('Password123');
  await page.locator('input[type="password"]').nth(1).fill('DifferentPass');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('[role="alert"]')).toBeVisible();
  await expect(page.locator('[role="alert"]')).toContainText(/סיסמאות|Passwords do not match/i);
});

test('UC-AUTH-13 | Sign Up fail — short password shows error', async ({ page }) => {
  await page.getByRole('button', { name: 'הרשם' }).click();
  await page.locator('input[type="email"]').fill('newuser@test.com');
  await page.locator('input[type="password"]').nth(0).fill('abc');
  await page.locator('input[type="password"]').nth(1).fill('abc');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('[role="alert"]')).toBeVisible();
  await expect(page.locator('[role="alert"]')).toContainText(/6|תווים|characters/i);
});

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────

test('UC-AUTH-14 | Forgot Password — button shows reset form', async ({ page }) => {
  await page.getByRole('button', { name: /שכחת סיסמה\?|Forgot Password\?/i }).click();
  await expect(page.getByRole('heading', { name: /איפוס סיסמה|Reset Password/i })).toBeVisible();
  await expect(page.locator('input[type="password"]')).not.toBeVisible();
  await expect(page.locator('button[type="submit"]')).toContainText(/שלח קישור|Send Reset Link/i);
});

test('UC-AUTH-15 | Forgot Password — back link returns to sign-in', async ({ page }) => {
  await page.getByRole('button', { name: /שכחת סיסמה\?|Forgot Password\?/i }).click();
  await page.getByRole('button', { name: /חזור להתחברות|Back to Sign In/i }).click();
  await expect(page.getByRole('button', { name: /התחבר עם גוגל|Sign in with Google/i })).toBeVisible();
});

test('UC-AUTH-16 | Forgot Password fail — empty email blocked by HTML5 validation', async ({ page }) => {
  await page.getByRole('button', { name: /שכחת סיסמה\?|Forgot Password\?/i }).click();
  await page.locator('button[type="submit"]').click();
  // Email field is required — browser prevents submission, stay on reset form
  await expect(page.getByRole('heading', { name: /איפוס סיסמה|Reset Password/i })).toBeVisible();
});
```

Note: UC-AUTH-11 through 16 replace the old numbering to stay consistent. Also update UC-AUTH-05 and UC-AUTH-09 references to match new numbers if needed.

- [ ] **Step 2: Remove old `test.fixme` blocks that are now covered**

Delete the four `test.fixme` blocks (UC-AUTH-10 through UC-AUTH-12 old, and UC-AUTH-15/16 old) that are now replaced by real tests above.

- [ ] **Step 3: Run auth tests (Chromium only, fast feedback)**

```bash
BASE_URL=http://localhost:5173 npx playwright test tests/auth.spec.ts --project=chromium --reporter=line
```

Expected: all non-fixme tests pass. Firebase-dependent tests (sign-up with real duplicate, sign-in with real wrong password) will show friendly error UI rather than crashing.

- [ ] **Step 4: Commit**

```bash
git add tests/auth.spec.ts
git commit -m "test(auth): activate and implement UC-AUTH-10 through UC-AUTH-16 sign-up and forgot-password tests"
```

---

## Task 5: Smoke-test end-to-end in the browser

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open http://localhost:5173

- [ ] **Step 2: Verify Sign Up mode**

1. Click "הרשם" / "Sign up" → heading changes to "יצירת חשבון חדש"
2. Google button is hidden
3. Three fields appear: email, password, confirm password
4. "← חזור להתחברות" returns to sign-in
5. Mismatched passwords shows red error banner
6. Short password shows red error banner

- [ ] **Step 3: Verify Forgot Password mode**

1. Click "שכחת סיסמה?" → heading changes to "איפוס סיסמה"
2. Password field is hidden
3. "← חזור להתחברות" returns to sign-in
4. Valid email → green "Reset email sent" message
5. Unknown email → red error message

- [ ] **Step 4: Verify Sign In still works**

Fill any email → "התחבר" → proceeds to assessment (existing behaviour preserved).

- [ ] **Step 5: Commit smoke-test sign-off**

```bash
git add -A
git commit -m "feat(auth): complete email auth flows — sign in, sign up, forgot password"
```

---

## Self-Review

**Spec coverage:**
- ✅ Email Sign In wired to `signInWithEmailAndPassword`
- ✅ Sign Up wired to `createUserWithEmailAndPassword`
- ✅ Forgot Password wired to `sendPasswordResetEmail`
- ✅ Friendly error messages for all Firebase error codes
- ✅ Success message for password reset
- ✅ Confirm-password client-side validation
- ✅ Minimum password length validation (6 chars, matching Firebase minimum)
- ✅ Mode switching: signin ↔ signup ↔ forgot (all with back links)
- ✅ Marketing sections hidden on signup/forgot to keep forms clean
- ✅ All Playwright fixme tests activated with real implementations
- ✅ Bilingual: all new strings in both Hebrew and English

**Placeholder scan:** None found — all code blocks are complete.

**Type consistency:**
- `signInWithEmail(email, password)` — defined Task 1, used Task 3 ✅
- `signUpWithEmail(email, password)` — defined Task 1, used Task 3 ✅
- `sendPasswordReset(email)` — defined Task 1, used Task 3 ✅
- `onEmailSignIn`, `onEmailSignUp`, `onForgotPassword` — defined Task 2 interface, passed Task 3, consumed Task 2 handler ✅
- `authError`, `authSuccess` — defined Task 3, typed `string | null`, passed and rendered Task 2 ✅
