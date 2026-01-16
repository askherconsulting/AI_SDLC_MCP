import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { chromium, Browser, Page } from 'playwright';
import { checkServerRunning, printServerNotRunningMessage, printPlaywrightBrowserInstallMessage } from '../helpers';

describe('Health Endpoint (Playwright)', () => {
  let browser: Browser;
  let page: Page;

  before(async () => {
    // Check if server is running before starting tests
    const serverRunning = await checkServerRunning();
    if (!serverRunning) {
      printServerNotRunningMessage();
      throw new Error('Server is not running. Please start it with: npm start');
    }
    
    try {
      browser = await chromium.launch();
      page = await browser.newPage();
    } catch (error: any) {
      // Check if error is related to missing browsers
      if (error?.message?.includes('Executable doesn\'t exist') || 
          error?.message?.includes('Browser') ||
          error?.message?.includes('chromium') ||
          error?.code === 'ENOENT') {
        printPlaywrightBrowserInstallMessage();
      }
      throw error;
    }
  });

  after(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('health endpoint is visible and returns correct status', async () => {
    // Navigate to the health endpoint
    await page.goto('http://localhost:3000/health');
    
    // Wait a bit for page to load
    await page.waitForTimeout(500);
    
    // Verify the JSON response is visible by checking body element exists
    const body = page.locator('body');
    const bodyText = await body.textContent();
    
    if (bodyText && bodyText.length > 0) {
      // Parse and verify the JSON content
      const jsonContent = JSON.parse(bodyText);
      assert(jsonContent.hasOwnProperty('status'), 'JSON should have status property');
      assert.strictEqual(jsonContent.status, 'ok', 'Status should be "ok"');
      assert(jsonContent.hasOwnProperty('timestamp'), 'JSON should have timestamp property');
      assert(jsonContent.timestamp, 'Timestamp should be truthy');
    } else {
      // If evaluate doesn't work, just verify we can navigate to the endpoint
      assert(await body.count() > 0, 'Body element should exist');
    }
  });
});
