import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { chromium, Browser, Page } from 'playwright';
import { checkServerRunning, printServerNotRunningMessage, printPlaywrightBrowserInstallMessage } from '../helpers';

describe('App Close (Playwright)', () => {
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

  test('app can be closed from the browser tab', async () => {
    // AI Generated Human Reviewed yes
    await page.goto('http://localhost:3000');
    
    const heading = page.locator('h1').first();
    await heading.waitFor({ state: 'visible' });
    
    await page.close();
    assert(page.isClosed(), 'Page should be closed after invoking close');
  });
});
