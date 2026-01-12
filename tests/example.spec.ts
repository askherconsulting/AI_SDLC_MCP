import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { browser } from 'vibium';
import { checkServerRunning, printServerNotRunningMessage } from './helpers';

describe('Homepage', () => {
  let vibe: Awaited<ReturnType<typeof browser.launch>>;

  before(async () => {
    // Check if server is running before starting tests
    const serverRunning = await checkServerRunning();
    if (!serverRunning) {
      printServerNotRunningMessage();
      throw new Error('Server is not running. Please start it with: npm start');
    }
    
    vibe = await browser.launch();
  });

  after(async () => {
    if (vibe) {
      await vibe.quit();
    }
  });

  test('homepage loads', async () => {
    await vibe.go('http://localhost:3000');
    
    // Wait for page to load and verify by checking for heading element
    const heading = await vibe.find('h1');
    const headingText = await heading.text();
    assert(headingText.length > 0, 'Page should have a heading');
  });
});
