
import { test, expect } from '@playwright/test';

test.describe('Feedback Mechanism', () => {

    test.beforeEach(async ({ page }) => {
        // Go directly to analysis view via a shortcut if possible, 
        // or just speed-run the assessment
        await page.goto('/');

        // Login - using accessible name from labels
        const nameInput = page.getByRole('textbox', { name: 'שם מלא' }).or(page.getByRole('textbox', { name: 'Full Name' }));
        const emailInput = page.getByRole('textbox', { name: 'כתובת אימייל' }).or(page.getByRole('textbox', { name: 'Email Address' }));
        await nameInput.fill('Feedback Tester');
        await emailInput.fill('feedback@test.com');
        await page.getByRole('button', { name: 'בואו נתחיל' }).or(page.getByRole('button', { name: 'Start Assessment' })).click();

        // Speed run questions - there are 18 questions
        for (let i = 0; i < 18; i++) {
            // Wait for question to be visible
            await expect(page.getByRole('heading', { level: 2 })).toBeVisible();

            // Click answer option "3" (middle option)
            await page.getByRole('button', { name: '3', exact: true }).click();
            await page.waitForTimeout(100);
        }

        // Wait for results - look for category names
        await expect(page.getByText('אוטונומיה', { exact: false }).or(page.getByText('Autonomy'))).toBeVisible();
    });

    test('Submit Feedback (Happy Path)', async ({ page }) => {
        // Scroll to feedback section
        const feedbackSection = page.locator('h4', { hasText: 'האם התובנות עזרו לך?' }).or(page.locator('h4', { hasText: 'Was this helpful?' }));
        await feedbackSection.scrollIntoViewIfNeeded();
        await expect(feedbackSection).toBeVisible();

        // Click Thumbs Up (assuming it's the first button or finding by icon)
        // detailed selector needed for thumbs up implementation
        // AnalysisView: button with ThumbsUp icon. 
        // We can look for the button that doesn't have the 'cancel' or 'down' look.
        // Actually, let's just click the first button in that container.
        const thumbsUpBtn = page.locator('button:has(svg.lucide-thumbs-up)');
        await thumbsUpBtn.click();

        // Check if comment box appears
        const commentBox = page.getByPlaceholder('נשמח לשמוע עוד', { exact: false }).or(page.getByPlaceholder('Tell us more'));
        await expect(commentBox).toBeVisible();

        // Fill comment
        await commentBox.fill('Automated test feedback comment');

        // Submit
        const sendBtn = page.getByRole('button', { name: 'שלח משוב' }).or(page.getByRole('button', { name: 'Send Feedback' }));
        await sendBtn.click();

        // Verify Success Message
        await expect(page.getByText('תודה על המשוב!', { exact: false }).or(page.getByText('Thanks!'))).toBeVisible();
    });
});
