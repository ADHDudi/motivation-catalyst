import { test, expect } from '@playwright/test';
import { openWelcome } from './helpers';

/**
 * Welcome screen and authentication — sign in, sign up, forgot password and
 * language switching. Sign-in attempts use made-up credentials, so Firebase
 * rejects them; full Google OAuth and real accounts are out of scope.
 */

const SIGN_IN_ERROR = /שגיאת|שגויים|Sign in failed|Invalid|Too many|Network/i;

test.describe('Welcome & authentication', () => {
    test.beforeEach(async ({ page }) => {
        await openWelcome(page);
    });

    test('UC-AUTH-00 | Welcome screen renders all auth elements', async ({ page }) => {
        const googleBtn = page.getByRole('button', { name: /התחבר עם גוגל/i });
        await expect(googleBtn).toBeVisible();
        await expect(googleBtn).toBeEnabled();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
        await expect(page.getByRole('button', { name: 'שכחת סיסמה?' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'הרשם' })).toBeVisible();
    });

    // ─── SIGN IN ─────────────────────────────────────────────────────────────

    test('UC-AUTH-01 | Sign In — wrong credentials show an error and stay on welcome', async ({ page }) => {
        await page.locator('input[type="email"]').fill('test@example.com');
        await page.locator('input[type="password"]').fill('wrong-password');
        await page.locator('button[type="submit"]').click();

        await expect(page.locator('[role="alert"]')).toContainText(SIGN_IN_ERROR);
        await expect(page.getByRole('heading', { name: 'MotivationOS' })).toBeVisible();
    });

    test('UC-AUTH-03 | Sign In — empty email is blocked by HTML5 validation', async ({ page }) => {
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('input[type="email"]:invalid')).toHaveCount(1);
        await expect(page.getByRole('heading', { name: 'MotivationOS' })).toBeVisible();
    });

    test('UC-AUTH-04 | Sign In — invalid email format is blocked by HTML5 validation', async ({ page }) => {
        await page.locator('input[type="email"]').fill('not-an-email');
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('input[type="email"]:invalid')).toHaveCount(1);
        await expect(page.getByRole('heading', { name: 'MotivationOS' })).toBeVisible();
    });

    test('UC-AUTH-07 | Google Sign In — click is handled without crashing', async ({ page }) => {
        // The OAuth popup can't be automated; close it if one opens.
        page.on('popup', popup => popup.close().catch(() => {}));
        await page.getByRole('button', { name: /התחבר עם גוגל/i }).click();
        await page.waitForTimeout(1500);
        await expect(page.getByRole('heading', { name: 'MotivationOS' })).toBeVisible();
    });

    // ─── SIGN UP ─────────────────────────────────────────────────────────────

    test('UC-AUTH-09 | Sign Up — form opens and back link returns to sign in', async ({ page }) => {
        await page.getByRole('button', { name: 'הרשם' }).click();
        await expect(page.getByRole('heading', { name: /יצירת חשבון|Create an Account/i })).toBeVisible();

        await page.getByRole('button', { name: /חזור להתחברות|Back to Sign In/i }).click();
        await expect(page.getByRole('button', { name: /התחבר עם גוגל|Sign in with Google/i })).toBeVisible();
    });

    test('UC-AUTH-11 | Sign Up — mismatched passwords show an error', async ({ page }) => {
        await page.getByRole('button', { name: 'הרשם' }).click();
        await page.locator('input[type="email"]').fill('newuser@test.com');
        await page.locator('input[type="password"]').nth(0).fill('Password123');
        await page.locator('input[type="password"]').nth(1).fill('DifferentPass');
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('[role="alert"]')).toContainText(/סיסמאות|Passwords do not match/i);
    });

    test('UC-AUTH-12 | Sign Up — short password shows an error', async ({ page }) => {
        await page.getByRole('button', { name: 'הרשם' }).click();
        await page.locator('input[type="email"]').fill('newuser@test.com');
        await page.locator('input[type="password"]').nth(0).fill('abc');
        await page.locator('input[type="password"]').nth(1).fill('abc');
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('[role="alert"]')).toContainText(/6|תווים|characters/i);
    });

    // ─── FORGOT PASSWORD ─────────────────────────────────────────────────────

    test('UC-AUTH-14 | Forgot Password — reset form opens and back link returns', async ({ page }) => {
        await page.getByRole('button', { name: 'שכחת סיסמה?' }).click();
        await expect(page.getByRole('heading', { name: /איפוס סיסמה|Reset Password/i })).toBeVisible();
        await expect(page.locator('input[type="password"]')).not.toBeVisible();
        await expect(page.locator('button[type="submit"]')).toContainText(/שלח קישור|Send Reset Link/i);

        await page.getByRole('button', { name: /חזור להתחברות|Back to Sign In/i }).click();
        await expect(page.getByRole('button', { name: /התחבר עם גוגל|Sign in with Google/i })).toBeVisible();
    });

    test('UC-AUTH-16 | Forgot Password — empty email is blocked by HTML5 validation', async ({ page }) => {
        await page.getByRole('button', { name: 'שכחת סיסמה?' }).click();
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('input[type="email"]:invalid')).toHaveCount(1);
        await expect(page.getByRole('heading', { name: /איפוס סיסמה|Reset Password/i })).toBeVisible();
    });

    // ─── LANGUAGE ────────────────────────────────────────────────────────────

    test('UC-AUTH-17 | Language — toggles to English (LTR) and back to Hebrew', async ({ page }) => {
        await page.getByRole('button', { name: 'EN' }).click();
        await expect(page.getByRole('button', { name: /Sign in with Google/i })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Forgot Password?' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
        await expect(page.locator('div[dir="ltr"]').first()).toBeVisible();

        await page.getByRole('button', { name: 'עב' }).click();
        await expect(page.getByRole('button', { name: /התחבר עם גוגל/i })).toBeVisible();
    });

    test('UC-AUTH-19 | Sign In in English — error message is in English', async ({ page }) => {
        await page.getByRole('button', { name: 'EN' }).click();
        await page.locator('input[type="email"]').fill('english@test.com');
        await page.locator('input[type="password"]').fill('Password123');
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('[role="alert"]')).toContainText(/Sign in failed|Invalid|Too many|Network/i);
    });
});
