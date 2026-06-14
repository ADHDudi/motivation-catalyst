import { test, expect } from '@playwright/test';
test('debug demo', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));
  await page.goto('/');
  await page.locator('input[type="email"]').fill('dudi');
  await page.getByRole('button', { name: 'mid', exact: true }).click();
  await page.waitForTimeout(2000);
});
