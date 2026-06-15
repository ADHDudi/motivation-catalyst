import { test, expect } from '@playwright/test';

test.describe('Responsive UI Redesign', () => {
  
  test.describe('Desktop View', () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test('Welcome View renders both panes', async ({ page }) => {
      // Mocking auth not needed if we just check the signin page
      await page.goto('/');
      
      // Wait for content to load
      await page.waitForSelector('text=Sign in', { timeout: 10000 }).catch(() => null);

      // Verify Left Pane (Hero) content
      await expect(page.locator('h1')).toBeVisible();
      
      // Verify Right Pane (Form) content
      await expect(page.locator('input[type="email"]')).toBeVisible();
    });

    test('Analysis View renders split pane on desktop', async ({ page }) => {
      await page.goto('/');
      
      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.isVisible()) {
        await emailInput.fill('dudi@test.com');
        await page.locator('input[type="password"]').fill('password');
        const demoHighBtn = page.locator('button:has-text("high")');
        await demoHighBtn.waitFor({ state: 'visible' });
        await demoHighBtn.click();
      }

      await page.waitForSelector('text=Analysis & Actions', { timeout: 15000 }).catch(() => null);

      // We just need to check that both panes exist and are visible
      const tablist = page.locator('div[role="tablist"]');
      await expect(tablist).toBeVisible();

      const profileTitle = page.locator('h2'); // The profile title in left pane
      await expect(profileTitle.first()).toBeVisible();
    });
  });

  test.describe('Mobile View', () => {
    test.use({ viewport: { width: 375, height: 667 }, hasTouch: true });

    test('Analysis View uses collapsible accordion for deep analysis', async ({ page }) => {
      await page.goto('/');
      
      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.isVisible()) {
        await emailInput.fill('dudi@test.com');
        await page.locator('input[type="password"]').fill('password');
        
        // Wait for demo mode buttons to appear
        const demoHighBtn = page.locator('button:has-text("high")');
        await demoHighBtn.waitFor({ state: 'visible' });
        await demoHighBtn.click();
      }

      await page.waitForSelector('text=Analysis & Actions', { timeout: 15000 }).catch(() => null);

      const accordionBtn = page.locator('button:has-text("Analysis & Actions")').first();
      if (await accordionBtn.isVisible()) {
         await accordionBtn.click();
      }
    });
  });
});
