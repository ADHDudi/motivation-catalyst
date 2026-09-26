import { test, expect, Page } from '@playwright/test';
import { mockAnalysis, openDemoAnalysis, openWelcome } from './helpers';

/** Responsive layout — desktop split panes vs. the mobile collapsible analysis. */

const analysisToggle = (page: Page) => page.getByRole('button', { name: /ניתוח ופעולות|Analysis & Actions/ }).first();
const analysisActions = (page: Page) => analysisToggle(page).locator('xpath=..').locator('ul');

test.describe('Desktop layout', () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test('LAY-01 | Welcome shows the hero pane beside the sign-in form', async ({ page }) => {
        await openWelcome(page);
        const hero = page.locator('h1');
        const form = page.locator('input[type="email"]');
        await expect(hero).toBeVisible();
        await expect(form).toBeVisible();

        // Side by side: the panes share a row instead of stacking
        const heroBox = await hero.boundingBox();
        const formBox = await form.boundingBox();
        expect(Math.abs(heroBox!.x - formBox!.x)).toBeGreaterThan(200);
    });

    test('LAY-02 | Analysis shows the profile and tabs, with analysis always expanded', async ({ page }) => {
        await mockAnalysis(page);
        await openDemoAnalysis(page);
        await expect(page.getByRole('tablist')).toBeVisible();
        await expect(analysisActions(page)).toBeVisible();
    });
});

test.describe('Mobile layout', () => {
    test.use({ viewport: { width: 375, height: 667 }, hasTouch: true });

    test('LAY-03 | Analysis & Actions is collapsed by default and expands on tap', async ({ page }) => {
        await mockAnalysis(page);
        await openDemoAnalysis(page);

        await expect(analysisActions(page)).toHaveCount(0);
        await analysisToggle(page).click();
        await expect(analysisActions(page)).toBeVisible();
    });
});
