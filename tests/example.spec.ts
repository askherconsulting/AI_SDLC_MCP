import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.afterEach(async ({ page }) => {
    // Teardown: Close the browser after each test
    await page.close();
  });

  // Teardown: Runs after all tests in this suite complete
  // Ensures browser cleanup after test suite
  test.afterAll(async () => {
    // Suite-level teardown - pages are already closed by afterEach
  });

  test('homepage loads', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/./);
  });
});
