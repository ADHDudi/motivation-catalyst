import { test, expect } from '@playwright/test';

test.describe('Motivation Catalyst Acceptance Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the base URL before each test
        console.log(`Running test against: ${test.info().project.use.baseURL}`);
        await page.goto('/');
    });

    test('Login / Registration (User Entry)', async ({ page }) => {
        // 1. Verify Welcome View loads - check for Hebrew title
        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).toBeVisible();

        // 2. Fill in form - using accessible name from labels instead of placeholder
        const nameInput = page.getByRole('textbox', { name: 'שם מלא' }).or(page.getByRole('textbox', { name: 'Full Name' }));
        const emailInput = page.getByRole('textbox', { name: 'כתובת אימייל' }).or(page.getByRole('textbox', { name: 'Email Address' }));

        await nameInput.fill('Acceptance Test User');
        await emailInput.fill('test@example.com');

        // 3. Submit
        const submitBtn = page.getByRole('button', { name: 'בואו נתחיל' }).or(page.getByRole('button', { name: 'Start Assessment' }));
        await submitBtn.click();

        // 4. Verify transition to Assessment View
        // Look for a question or progress indicator
        await expect(page.getByRole('heading', { name: /שאלה 1/i }).or(page.getByRole('heading', { name: /Question 1/i }))).toBeVisible();
    });

    test('Main User Flow (Happy Path)', async ({ page }) => {
        // Login first - using accessible name from labels
        const nameInput = page.getByRole('textbox', { name: 'שם מלא' }).or(page.getByRole('textbox', { name: 'Full Name' }));
        const emailInput = page.getByRole('textbox', { name: 'כתובת אימייל' }).or(page.getByRole('textbox', { name: 'Email Address' }));
        await nameInput.fill('Happy Path User');
        await emailInput.fill('happy@example.com');
        const submitBtn = page.getByRole('button', { name: 'בואו נתחיל' }).or(page.getByRole('button', { name: 'Start Assessment' }));
        await submitBtn.click();

        // Answer questions
        // There are 18 questions. We'll answer them all.
        // App.tsx: handleAnswer sets next question automatically on click.

        for (let i = 0; i < 18; i++) {
            // Wait for question heading to be visible
            await expect(page.getByRole('heading', { level: 2 })).toBeVisible();

            // Select answer option "3" (middle option on 1-5 scale)
            // The buttons are labeled "1", "2", "3", "4", "5"
            const answerButton = page.getByRole('button', { name: '3', exact: true });
            await answerButton.click();

            // Small wait to ensure transition
            await page.waitForTimeout(150);
        }

        // Verify Analysis View loads - look specifically for the AI Insights section heading
        const aiSectionHeading = page.getByRole('heading', { name: /ניתוח AI מעמיק/i }).or(page.getByRole('heading', { name: /AI Deep Analysis/i }));
        await expect(aiSectionHeading).toBeVisible({ timeout: 45000 });

        // Verify ADHD Tip is visible (wait for it to appear specifically)
        const adhdTipHeading = page.getByText('טיפ מותאם קשב (ADHD)').or(page.getByText('ADHD Focus Tip'));
        await expect(adhdTipHeading.first()).toBeVisible({ timeout: 15000 });
    });

    test('English/Hebrew Alignment', async ({ page }) => {
        // 1. Check default language (Hebrew) - look for Hebrew heading
        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).toBeVisible();

        // 2. Toggle Language
        const langBtn = page.getByRole('button', { name: 'EN' });
        await langBtn.click();

        // 3. Verify English
        await expect(page.getByText('Welcome', { exact: false }).or(page.getByText('Motivation Catalyst', { exact: false }))).toBeVisible();
        // Check direction attribute on container
        const container = page.locator('div[dir="ltr"]');
        await expect(container).toBeVisible();

        // 4. Toggle back to Hebrew
        const heBtn = page.getByRole('button', { name: 'עב' });
        await heBtn.click();
        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' })).toBeVisible();
    });

});
