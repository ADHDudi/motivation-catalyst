import { test, expect } from '@playwright/test';

test.describe('Motivation Catalyst Acceptance Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the base URL before each test
        console.log(`Running test against: ${test.info().project.use.baseURL}`);
        await page.goto('/');
    });

    test('Login / Registration (User Entry)', async ({ page }) => {
        // 1. Verify Welcome View loads
        await expect(page.getByText('Motivation Catalyst', { exact: false })).toBeVisible();

        // 2. Fill in form
        const nameInput = page.getByPlaceholder('שם העובד', { exact: false }).or(page.getByPlaceholder('Employee Name'));
        const emailInput = page.getByPlaceholder('אימייל העובד', { exact: false }).or(page.getByPlaceholder('Employee Email'));

        // Check if Inputs are visible (they might be under a different placeholder depending on lang)
        // We can use the 'name' attribute if available, or just placeholder. 
        // The App code uses placeholders: t.employeeName 
        // Let's assume Hebrew default as per App.tsx

        await nameInput.fill('Acceptance Test User');
        await emailInput.fill('test@example.com');

        // 3. Submit
        const submitBtn = page.getByRole('button', { name: 'התחל' }).or(page.getByRole('button', { name: 'Begin' }));
        await submitBtn.click();

        // 4. Verify transition to Assessment View
        // Look for a question or progress indicator
        await expect(page.getByText('שאלה 1', { exact: false }).or(page.getByText('Question 1'))).toBeVisible();
    });

    test('Main User Flow (Happy Path)', async ({ page }) => {
        // Login first
        const nameInput = page.getByPlaceholder('שם העובד', { exact: false }).or(page.getByPlaceholder('Employee Name'));
        const emailInput = page.getByPlaceholder('אימייל העובד', { exact: false }).or(page.getByPlaceholder('Employee Email'));
        await nameInput.fill('Happy Path User');
        await emailInput.fill('happy@example.com');
        const submitBtn = page.getByRole('button', { name: 'התחל' }).or(page.getByRole('button', { name: 'Begin' }));
        await submitBtn.click();

        // Answer questions
        // There are 24 questions. We'll answer them all.
        // We need to wait for the question to appear.
        // We can simulate answering by clicking options.

        // Loop through questions. 
        // We look for the "next" or just clicking an option triggers next? 
        // App.tsx: handleAnswer sets next question.
        // We need to find the answer buttons. 

        for (let i = 0; i < 24; i++) {
            // Wait for question to be visible
            await expect(page.locator('.text-xl.font-bold.text-slate-800')).toBeVisible();

            // Select an answer (e.g., the 3rd option - value 3)
            // options are buttons with class containing 'p-4' and 'rounded-xl'
            // Let's click the middle one.
            // The options usually range 1-5.
            // Implementation might vary, let's look for a button with text or index.
            const options = page.locator('button.w-full.text-right'); // Based on typical UI, need to verify selector
            // Actually, let's use a more robust selector.
            // Assuming there are 5 buttons for 1-5 scale.

            // Let's try to click the button with text for "3" or just the 3rd button.
            await page.locator('button').filter({ hasText: '3' }).first().click().catch(() => {
                // Fallback if text '3' isn't on the button, maybe just click the 3rd button in the list of answers
                page.locator('div.space-y-3 > button').nth(2).click();
            });

            // Small wait to ensure transition
            await page.waitForTimeout(100);
        }

        // Verify Analysis View
        await expect(page.getByText('ניתוח', { exact: false }).or(page.getByText('Analysis'))).toBeVisible();

        // Verify Results
        await expect(page.getByText('אוטונומיה', { exact: false }).or(page.getByText('Autonomy'))).toBeVisible();
    });

    test('English/Hebrew Alignment', async ({ page }) => {
        // 1. Check default language (Hebrew)
        await expect(page.locator('html')).not.toHaveAttribute('dir', 'ltr'); // Should be rtl or default
        // or checks specific text
        await expect(page.getByText('ברוכים הבאים', { exact: false })).toBeVisible();

        // 2. Toggle Language
        const langBtn = page.getByRole('button', { name: 'EN' });
        await langBtn.click();

        // 3. Verify English
        await expect(page.getByText('Welcome', { exact: false })).toBeVisible();
        // Check direction
        // The implementation switches 'dir' on the container div usually, or html.
        // App.tsx: <div dir={t.dir}> ...
        const container = page.locator('div[dir="ltr"]');
        await expect(container).toBeVisible();

        // 4. Toggle back
        const heBtn = page.getByRole('button', { name: 'עב' });
        await heBtn.click();
        await expect(page.getByText('ברוכים הבאים', { exact: false })).toBeVisible();
    });

});
