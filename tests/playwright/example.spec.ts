import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { chromium, Browser, Page } from 'playwright';
import { checkServerRunning, printServerNotRunningMessage, printPlaywrightBrowserInstallMessage } from '../helpers';

describe('Homepage (Playwright)', () => {
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

  test('homepage loads', async () => {
    await page.goto('http://localhost:3000');
    
    // Wait for page to load and verify by checking for heading element
    const heading = page.locator('h1').first();
    await heading.waitFor({ state: 'visible' });
    const headingText = await heading.textContent();
    assert(headingText && headingText.length > 0, 'Page should have a heading');
  });
});
