import { test, describe, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { browser } from 'vibium';

describe('Health Endpoint', () => {
  let vibe: Awaited<ReturnType<typeof browser.launch>>;

  afterEach(async () => {
    // Teardown: Close the browser after each test
    if (vibe) {
      await vibe.quit();
      vibe = null as any;
    }
  });

  test('health endpoint is visible and returns correct status', async () => {
    vibe = await browser.launch();
    
    // Navigate to the health endpoint
    await vibe.go('http://localhost:3000/health');
    
    // Verify the JSON response is visible
    const bodyText = await vibe.evaluate<string>(() => document.body.textContent || '');
    assert(bodyText.length > 0, 'Body text should not be empty');
    
    // Parse and verify the JSON content
    const jsonContent = JSON.parse(bodyText);
    assert(jsonContent.hasOwnProperty('status'), 'JSON should have status property');
    assert.strictEqual(jsonContent.status, 'ok', 'Status should be "ok"');
    assert(jsonContent.hasOwnProperty('timestamp'), 'JSON should have timestamp property');
    assert(jsonContent.timestamp, 'Timestamp should be truthy');
    
    // Verify the response contains the expected status text
    assert(bodyText.includes('"status":"ok"'), 'Body should contain "status":"ok"');
  });
});
