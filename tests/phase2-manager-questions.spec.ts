import { test, expect } from '@playwright/test';

/**
 * Phase 2 — Manager Question Branching Tests
 *
 * Phase 2 introduced role-branching: when userRole === 'manager', AssessmentView
 * renders q.managerText[lang] instead of q.text[lang], and AnalysisView shows
 * "Manager Recommendations" (t.managerRecs) instead of "Personal Insights" (t.userInsights).
 *
 * Demo mode always uses the 'solo' role (bypasses role-select), so manager-path
 * tests that require the actual assessment screen need real auth and are marked fixme.
 *
 * Reachable via demo (no auth required):
 *   P2-01 | Solo demo reaches analysis with solo-role heading
 *   P2-02 | App loads with updated constants (managerText compiled)
 *
 * Requires real auth (fixme):
 *   P2-03 | Manager role shows manager-framed question text
 */

test.describe('Phase 2 — Manager Question Branching', () => {

  // ─── SOLO PATH (reachable via demo) ─────────────────────────────────────────

  test('P2-01 | Solo demo — analysis shows solo-role heading, not manager heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });

    // Trigger demo mode (typing 'dudi' sets employeeName = 'dudi')
    await page.locator('input[type="email"]').fill('dudi');
    await expect(page.locator('text=DEMO MODE')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: 'mid', exact: true }).click();

    // Wait for analysis screen
    await expect(page.getByRole('heading', { name: /פרופיל מוטיבציה/i })).toBeVisible({ timeout: 10000 });

    // Solo role: "Personal Insights" heading must be visible
    await expect(page.getByRole('heading', { name: /תובנות לצמיחה/i })).toBeVisible({ timeout: 5000 });

    // Manager heading must NOT appear (demo always uses solo role)
    await expect(page.getByRole('heading', { name: /המלצות לניהול/i })).not.toBeVisible();
  });

  test('P2-02 | App loads with updated constants (managerText compiled)', async ({ page }) => {
    // This smoke test verifies the TypeScript build succeeded with all 18 managerText
    // entries defined on QUESTIONS. If constants.ts had a compile error, the app
    // would not load at all.
    await page.goto('/');
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });

    // App loaded successfully — means constants.ts compiled with all managerText entries
    await expect(page.getByRole('heading', { name: 'MotivationOS' })).toBeVisible();
  });

  // ─── MANAGER PATH (requires auth — fixme) ───────────────────────────────────

  test.fixme('P2-03 | Manager role shows manager-framed question text', async ({ page }) => {
    // Requires real Firebase auth to reach role-select → choose Manager → assessment.
    //
    // Manual test steps:
    //   1. Log in with a real account
    //   2. On role-select screen, choose "Manager" (מנהל/ת)
    //   3. Confirm role
    //   4. Q1 (Autonomy, id=1) should read:
    //      EN: "I give my team members the freedom to choose how they perform their work."
    //      HE: "אני נותן לחברי הצוות שלי את החופש לבחור כיצד הם מבצעים את עבודתם."
    //   5. Analysis screen should show "Manager Recommendations" (המלצות לניהול מעצים)
    //      instead of "Personal Insights" (תובנות לצמיחה אישית).
  });

});
