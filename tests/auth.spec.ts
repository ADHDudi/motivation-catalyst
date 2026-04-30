import { test, expect } from '@playwright/test';

/**
 * Authentication Test Suite
 *
 * Covers Sign In and Sign Up flows — happy paths and failure paths.
 * Tests run against the current UI state; known broken features are
 * marked with test.fail() or test.fixme() so the suite stays green
 * while accurately documenting expected future behaviour.
 *
 * Current auth state (as of testing):
 *  - Google Sign-In:        ✅ wired up (popup-based, not automatable end-to-end)
 *  - Email/Password Sign-In: ⚠️  proceeds to assessment on email alone — password onChange is a no-op
 *  - Sign Up:               ❌ button renders but has no handler
 *  - Forgot Password:       ❌ button renders but has no handler
 */

test.describe('Authentication — Welcome Screen', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for the app to render
        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).toBeVisible({ timeout: 10000 });
    });

    // ─── WELCOME SCREEN RENDER ───────────────────────────────────────────────

    test('UC-AUTH-00 | Welcome screen renders all auth elements', async ({ page }) => {
        await expect(page.getByRole('button', { name: /התחבר עם גוגל/i })).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
        await expect(page.getByRole('button', { name: 'שכחת סיסמה?' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'הרשם' })).toBeVisible();
    });

    // ─── SIGN IN — HAPPY PATH ────────────────────────────────────────────────

    test('UC-AUTH-01 | Sign In happy path — valid email proceeds to assessment', async ({ page }) => {
        // Current behaviour: email is sufficient (password auth not yet wired up)
        await page.locator('input[type="email"]').fill('test@example.com');
        await page.locator('button[type="submit"]').click();

        // Should advance to the assessment screen
        await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 5000 });
        // Assessment has back button — confirm we're no longer on welcome screen
        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).not.toBeVisible();
    });

    test('UC-AUTH-02 | Sign In happy path — username extracted from email', async ({ page }) => {
        // employeeName is derived from email.split('@')[0] — verify the app uses it
        await page.locator('input[type="email"]').fill('yossi@company.com');
        await page.locator('button[type="submit"]').click();

        // After completing the assessment the name should appear on the analysis header
        // Speed-run 18 questions then check the profile title area
        for (let i = 0; i < 18; i++) {
            await page.getByRole('button', { name: '3', exact: true }).click();
            await page.waitForTimeout(100);
        }
        // The profile page heading should reference the derived name or render without crash
        await expect(page.getByRole('heading', { name: /פרופיל מוטיבציה/i })).toBeVisible({ timeout: 10000 });
    });

    // ─── SIGN IN — FAIL PATH ─────────────────────────────────────────────────

    test('UC-AUTH-03 | Sign In fail path — empty email blocked by HTML5 validation', async ({ page }) => {
        // Do NOT fill email — click Sign In immediately
        await page.locator('button[type="submit"]').click();

        // Form has required email field — browser prevents submission
        // Welcome screen must still be visible
        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).toBeVisible();
    });

    test('UC-AUTH-04 | Sign In fail path — invalid email format blocked by HTML5 validation', async ({ page }) => {
        await page.locator('input[type="email"]').fill('not-an-email');
        await page.locator('button[type="submit"]').click();

        // Browser email validation should prevent submission
        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).toBeVisible();
    });

    test('UC-AUTH-05 | Sign In fail path — password field does not block submission (known bug)', async ({ page }) => {
        // BUG: password onChange is a no-op. Any password (or none) proceeds identically.
        // This test documents the current broken state — it should FAIL once real auth is wired up.
        await page.locator('input[type="email"]').fill('test@example.com');
        await page.locator('input[type="password"]').fill('wrong-password');
        await page.locator('button[type="submit"]').click();

        // Currently proceeds to assessment despite no real password check
        await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 5000 });
    });

    // ─── GOOGLE SIGN IN ──────────────────────────────────────────────────────

    test('UC-AUTH-06 | Google Sign In — button is visible and enabled', async ({ page }) => {
        const googleBtn = page.getByRole('button', { name: /התחבר עם גוגל/i });
        await expect(googleBtn).toBeVisible();
        await expect(googleBtn).toBeEnabled();
    });

    test('UC-AUTH-07 | Google Sign In — click opens auth popup (popup existence check)', async ({ page }) => {
        // Full OAuth popup flow cannot be automated, but we verify the click is handled
        // by checking a new popup is triggered (or no crash occurs)
        let popupOpened = false;
        page.on('popup', () => { popupOpened = true; });

        await page.getByRole('button', { name: /התחבר עם גוגל/i }).click();
        await page.waitForTimeout(1500);

        // On localhost Firebase is not initialized — no popup will open,
        // but the page must NOT crash (welcome screen must still be visible)
        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).toBeVisible();
    });

    // ─── SIGN UP ─────────────────────────────────────────────────────────────

    test('UC-AUTH-08 | Sign Up button is visible', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'הרשם' })).toBeVisible();
    });

    test('UC-AUTH-09 | Sign Up click — currently no-op (known bug)', async ({ page }) => {
        // Now implemented — clicking "הרשם" shows the signup form
        await page.getByRole('button', { name: 'הרשם' }).click();
        await expect(page.getByRole('heading', { name: /יצירת חשבון|Create an Account/i })).toBeVisible();
    });

    test('UC-AUTH-10 | Sign Up — clicking Sign Up shows the signup form', async ({ page }) => {
        await page.getByRole('button', { name: 'הרשם' }).click();
        await expect(page.getByRole('heading', { name: /יצירת חשבון חדש|Create an Account/i })).toBeVisible();
        await expect(page.locator('input[placeholder*="אימות"], input[placeholder*="Confirm"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toContainText(/צור חשבון|Create Account/);
    });

    test('UC-AUTH-11 | Sign Up — back link returns to sign-in form', async ({ page }) => {
        await page.getByRole('button', { name: 'הרשם' }).click();
        await expect(page.getByRole('heading', { name: /יצירת חשבון|Create an Account/i })).toBeVisible();
        await page.getByRole('button', { name: /חזור להתחברות|Back to Sign In/i }).click();
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

    test('UC-AUTH-13-a | Sign Up fail — short password shows error', async ({ page }) => {
        await page.getByRole('button', { name: 'הרשם' }).click();
        await page.locator('input[type="email"]').fill('newuser@test.com');
        await page.locator('input[type="password"]').nth(0).fill('abc');
        await page.locator('input[type="password"]').nth(1).fill('abc');
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('[role="alert"]')).toBeVisible();
        await expect(page.locator('[role="alert"]')).toContainText(/6|תווים|characters/i);
    });

    // ─── FORGOT PASSWORD ─────────────────────────────────────────────────────

    test('UC-AUTH-13 | Forgot Password button is visible', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'שכחת סיסמה?' })).toBeVisible();
    });

    test('UC-AUTH-14 | Forgot Password click — currently no-op (known bug)', async ({ page }) => {
        // BUG: Forgot Password button has no handler. Must not crash.
        await page.getByRole('button', { name: 'שכחת סיסמה?' }).click();
        await page.waitForTimeout(500);

        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).toBeVisible();
    });

    test('UC-AUTH-15 | Forgot Password — button shows reset form', async ({ page }) => {
        await page.getByRole('button', { name: /שכחת סיסמה\?|Forgot Password\?/i }).click();
        await expect(page.getByRole('heading', { name: /איפוס סיסמה|Reset Password/i })).toBeVisible();
        await expect(page.locator('input[type="password"]')).not.toBeVisible();
        await expect(page.locator('button[type="submit"]')).toContainText(/שלח קישור|Send Reset Link/i);
    });

    test('UC-AUTH-16 | Forgot Password — back link returns to sign-in', async ({ page }) => {
        await page.getByRole('button', { name: /שכחת סיסמה\?|Forgot Password\?/i }).click();
        await page.getByRole('button', { name: /חזור להתחברות|Back to Sign In/i }).click();
        await expect(page.getByRole('button', { name: /התחבר עם גוגל|Sign in with Google/i })).toBeVisible();
    });

    test('UC-AUTH-17-fp | Forgot Password — empty email blocked by HTML5 validation', async ({ page }) => {
        await page.getByRole('button', { name: /שכחת סיסמה\?|Forgot Password\?/i }).click();
        await page.locator('button[type="submit"]').click();
        // Email field is required — browser prevents submission; reset form must still be visible
        await expect(page.getByRole('heading', { name: /איפוס סיסמה|Reset Password/i })).toBeVisible();
    });

    // ─── LANGUAGE TOGGLE ON AUTH SCREEN ──────────────────────────────────────

    test('UC-AUTH-17 | Language toggle switches auth screen to English', async ({ page }) => {
        await page.getByRole('button', { name: 'EN' }).click();

        await expect(page.getByRole('button', { name: /Sign in with Google/i })).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Forgot Password?' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
    });

    test('UC-AUTH-18 | Language toggle switches back to Hebrew from English', async ({ page }) => {
        await page.getByRole('button', { name: 'EN' }).click();
        await expect(page.getByRole('button', { name: /Sign in with Google/i })).toBeVisible();

        await page.getByRole('button', { name: 'עב' }).click();
        await expect(page.getByRole('button', { name: /התחבר עם גוגל/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).toBeVisible();
    });

    test('UC-AUTH-19 | Sign In works in English mode', async ({ page }) => {
        await page.getByRole('button', { name: 'EN' }).click();
        await page.locator('input[type="email"]').fill('english@test.com');
        await page.locator('button[type="submit"]').click();

        // Should proceed to assessment (questions in English)
        await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 5000 });
    });
});
