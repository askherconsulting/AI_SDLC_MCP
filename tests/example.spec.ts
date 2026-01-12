import { test, describe, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { browser } from 'vibium';

describe('Homepage', () => {
  let vibe: Awaited<ReturnType<typeof browser.launch>>;

  afterEach(async () => {
    // Teardown: Close the browser after each test
    if (vibe) {
      await vibe.quit();
      vibe = null as any;
    }
  });

  test('homepage loads', async () => {
    vibe = await browser.launch();
    await vibe.go('http://localhost:3000');
    
    // Verify page loaded by checking title
    const title = await vibe.evaluate<string>(() => document.title);
    assert(title.length > 0, 'Page title should not be empty');
  });
});
