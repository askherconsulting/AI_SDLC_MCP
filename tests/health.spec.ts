import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }) => {
  // Teardown: Close the browser after each test
  await page.close();
});

test('health endpoint is visible and returns correct status', async ({ page }) => {
  // Navigate to the health endpoint
  await page.goto('http://localhost:3000/health');
  
  // Verify the page URL
  await expect(page).toHaveURL('http://localhost:3000/health');
  
  // Verify the JSON response is visible
  const bodyText = await page.textContent('body');
  expect(bodyText).toBeTruthy();
  
  // Parse and verify the JSON content
  const jsonContent = JSON.parse(bodyText!);
  expect(jsonContent).toHaveProperty('status');
  expect(jsonContent.status).toBe('ok');
  expect(jsonContent).toHaveProperty('timestamp');
  expect(jsonContent.timestamp).toBeTruthy();
  
  // Verify the response contains the expected status text
  await expect(page.locator('body')).toContainText('"status":"ok"');
});
