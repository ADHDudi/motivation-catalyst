
import { test, expect } from '@playwright/test';

test.describe('Feedback Mechanism', () => {

    test.beforeEach(async ({ page }) => {
        // Go directly to analysis view via a shortcut if possible,
        // or just speed-run the assessment
        await page.goto('/');

        // Wait for welcome screen to be visible
        await expect(page.getByRole('heading', { name: 'קתליזטור למוטיבציה' }).or(page.getByRole('heading', { name: 'The Motivation Catalyst' }))).toBeVisible({ timeout: 10000 });

        // Use demo mode to bypass authentication - enter "dudi" as email to trigger demo buttons
        const emailInput = page.locator('input[type="email"]');
        await emailInput.fill('dudi@test.com');

        // Demo mode should appear - click to launch demo
        await page.waitForTimeout(500); // Wait for demo buttons to appear
        const demoBtn = page.locator('button').filter({ hasText: /high|mid|at-risk/ }).first();
        await demoBtn.click();

        // Wait for analysis view to load - demo skips the assessment questions
        await expect(page.getByText('אוטונומיה', { exact: false }).or(page.getByText('Autonomy')).first()).toBeVisible({ timeout: 10000 });
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
