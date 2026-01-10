import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }) => {
  // Teardown: Close the browser after each test
  await page.close();
});

test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/./);
});
