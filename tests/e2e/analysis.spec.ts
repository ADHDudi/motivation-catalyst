import { test, expect } from '@playwright/test';
import { getFirestoreWrites, mockAnalysis, openDemoAnalysis, stubFirestoreWrites, waitForMockedTip } from './helpers';

/**
 * Analysis screen — reached through demo mode with the AI Cloud Function mocked.
 * Demo mode skips auth and the assessment, and always uses the solo role.
 */

const CATEGORIES = [
    { tab: /אוטונומיה|Autonomy/, heading: /אוטונומיה/, tip: 'טיפ AI מדומה לאוטונומיה', adhd: 'טיפ קשב מדומה לאוטונומיה' },
    { tab: /מסוגלות|Competence/, heading: /מסוגלות/, tip: 'טיפ AI מדומה למסוגלות', adhd: 'טיפ קשב מדומה למסוגלות' },
    { tab: /שייכות|Relatedness/, heading: /שייכות/, tip: 'טיפ AI מדומה לשייכות', adhd: 'טיפ קשב מדומה לשייכות' },
];

test.describe('Analysis screen (mocked AI)', () => {
    test.beforeEach(async ({ page }) => {
        await mockAnalysis(page);
        await openDemoAnalysis(page);
    });

    test('AC-01 | Demo mode lands on analysis with the solo role', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'MotivationOS' })).not.toBeVisible();
        // Solo role label shows, manager label doesn't (P2-01)
        await expect(page.getByText('תורם/ת יחיד/ה', { exact: true })).toBeVisible();
        await expect(page.getByText('מנהל/ת', { exact: true })).not.toBeVisible();
    });

    test('AC-04 | Each category tab shows its score, AI tip, ADHD tip and analysis', async ({ page }) => {
        await waitForMockedTip(page);

        for (const category of CATEGORIES) {
            await test.step(`${category.tip.split(' ').pop()} tab`, async () => {
                await page.getByRole('tab', { name: category.tab }).click();
                await expect(page.getByRole('heading', { name: category.heading }).first()).toBeVisible();
                await expect(page.getByText('טיפ AI', { exact: true }).first()).toBeVisible();
                await expect(page.getByText(category.tip)).toBeVisible();
                await expect(page.getByRole('button', { name: /ניתוח ופעולות|Analysis & Actions/ }).first()).toBeVisible();

                await page.getByRole('button', { name: /טיפ מותאם קשב|ADHD Focus Tip/i }).click();
                await expect(page.getByText(category.adhd)).toBeVisible();
            });
        }
    });

    test('AC-08 | Actions tab — Copy Full Report shows a confirmation, no reminder option', async ({ page, context, browserName }) => {
        if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await waitForMockedTip(page);
        await page.getByRole('tab', { name: /פעולות|Actions/i }).click();

        // The reminder option was removed (AC-08.5)
        await expect(page.getByText(/תזכורת|Reminder/i)).not.toBeVisible();

        const copyBtn = page.getByRole('button', { name: /העתק/i }).first();
        await copyBtn.scrollIntoViewIfNeeded();
        await copyBtn.click();
        await expect(page.locator('div[class*="fixed"]')).toBeVisible({ timeout: 3000 });
    });

    test('AC-09 | Start Over returns to the welcome screen', async ({ page }) => {
        await waitForMockedTip(page);
        const startOverBtn = page.getByRole('button', { name: /התחל שאלון מחדש/i });
        await startOverBtn.scrollIntoViewIfNeeded();
        await startOverBtn.click();
        await expect(page.getByRole('heading', { name: 'MotivationOS' })).toBeVisible({ timeout: 5000 });
    });

    test('AC-11 | Language — analysis toggles to English and back to Hebrew', async ({ page }) => {
        await waitForMockedTip(page);

        await page.getByRole('button', { name: 'Toggle language' }).click();
        await expect(page.getByRole('heading', { name: /Motivation Profile/i })).toBeVisible();
        await expect(page.getByRole('tab', { name: /Autonomy/i })).toBeVisible();
        await expect(page.getByText('AI Tip', { exact: true }).first()).toBeVisible();

        await page.getByRole('button', { name: 'Toggle language' }).click();
        await expect(page.getByRole('heading', { name: /פרופיל מוטיבציה/ })).toBeVisible();
    });

    test('FB-01 | Feedback — rating, comment and submit show the thank-you reward', async ({ page }) => {
        // Never write test feedback to the real Firestore project
        await stubFirestoreWrites(page);
        await page.getByRole('tab', { name: /פעולות|Actions/i }).click();

        const heading = page.getByRole('heading', { name: /איך החוויה שלך עד כה\?|How is your experience so far\?/ });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        await page.getByRole('button', { name: 'Rate 4 stars' }).click();
        const commentBox = page.getByPlaceholder(/ספר\/י לנו עוד|Tell us more/);
        await expect(commentBox).toBeVisible();
        await commentBox.fill('Test feedback from automation');

        await page.getByRole('button', { name: /שלח וגלה את הבונוס|Submit & Unlock Bonus/ }).click();
        await expect(page.getByRole('heading', { name: /תודה על הפידבק!|Thanks for your feedback!/ })).toBeVisible({ timeout: 10000 });

        const writes = await getFirestoreWrites(page);
        expect(writes).toHaveLength(1);
        expect(writes[0].collection).toBe('feedback');
        expect(writes[0].doc).toMatchObject({ rating: 4, comment: 'Test feedback from automation' });
    });
});

test.describe('Analysis screen (real AI backend)', () => {
    // Calls the deployed Cloud Function (and Gemini) — run it once, not per browser.
    test.skip(({ browserName }) => browserName !== 'chromium', 'Real backend call runs in Chromium only');

    test('AC-13 | AI tip is generated, personalized, and the spinner never gets stuck', async ({ page }) => {
        test.setTimeout(60000);
        await openDemoAnalysis(page);

        const generating = page.getByText('מייצר...', { exact: true }).or(page.getByText('Generating...', { exact: true }));
        await expect(generating.first()).toBeHidden({ timeout: 40000 });

        const personalized = page.getByText('מותאם', { exact: true }).or(page.getByText('Personalized', { exact: true }));
        await expect(personalized.first()).toBeVisible({ timeout: 10000 });
        const staticBadge = page.getByText('סטטי', { exact: true }).or(page.getByText('Static', { exact: true }));
        await expect(staticBadge.first()).not.toBeVisible();
    });
});

test.describe('Needs real auth', () => {
    test.fixme('AC-03 | Assessment — back button on the first question returns to welcome', async () => {
        // Needs a signed-in user to reach question 1 (Firebase emulator or test credentials).
    });

    test.fixme('P2-03 | Manager role shows manager-framed question text', async () => {
        // Sign in → role select → Manager → Q1 (Autonomy) should read:
        //   HE: "אני נותן לחברי הצוות שלי את החופש לבחור כיצד הם מבצעים את עבודתם."
        //   EN: "I give my team members the freedom to choose how they perform their work."
        // The analysis role label should then read "מנהל/ת" / "Manager".
    });
});
