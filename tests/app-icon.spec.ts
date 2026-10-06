import { test, expect, Page } from '@playwright/test';
import { VIEWS } from './support/views';

const appIcon = (page: Page) => page.getByRole('img', { name: 'MotivationOS' });

for (const view of VIEWS) {
  test.describe(`App icon — welcome screen — ${view.name}`, () => {
    test.use(view.use);

    test('shows the app icon once, labelled MotivationOS', async ({ page }) => {
      await page.goto('/');

      await expect(appIcon(page)).toHaveCount(1);
      await expect(appIcon(page)).toBeVisible();
    });

    test('shows the same, unmirrored icon in Hebrew (RTL) and English (LTR)', async ({ page }) => {
      await page.goto('/');
      const mirrored = () => appIcon(page).evaluate(el => getComputedStyle(el).transform.startsWith('matrix(-1'));

      await expect(appIcon(page)).toBeVisible();
      expect(await mirrored()).toBe(false);

      await page.getByRole('button', { name: 'EN' }).click();
      await expect(page.getByRole('button', { name: 'עב' })).toBeVisible();

      await expect(appIcon(page)).toHaveCount(1);
      await expect(appIcon(page)).toBeVisible();
      expect(await mirrored()).toBe(false);
    });
  });
}

test.describe('App icon — welcome screen — Mobile view (small phone)', () => {
  test.use(VIEWS[0].use);

  test('keeps the icon and title above the fold', async ({ page }) => {
    await page.goto('/');

    await expect(appIcon(page)).toBeInViewport({ ratio: 1 });
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport({ ratio: 1 });
  });
});

const openDemoAnalysis = async (page: Page) => {
  await page.goto('/');
  await page.locator('input[type="email"]').fill('dudi');
  await page.getByRole('button', { name: 'high' }).click();
};

for (const view of VIEWS) {
  test.describe(`App icon — header logo — ${view.name}`, () => {
    test.use(view.use);

    test('shows the app icon next to the MotivationOS wordmark', async ({ page }) => {
      await openDemoAnalysis(page);

      const logo = page.getByRole('link', { name: /MotivationOS/ }).first();
      await expect(logo).toBeVisible();
      await expect(logo.getByTestId('app-icon')).toBeVisible();
    });
  });
}
