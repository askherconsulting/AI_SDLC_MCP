import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { checkServerRunning, printServerNotRunningMessage, launchVibiumBrowserWithTimeout } from '../helpers';
import * as http from 'http';

describe('Health Endpoint Negative Tests (Vibium)', () => {
  let vibe: Awaited<ReturnType<typeof import('vibium').browser.launch>>;

  before(async () => {
    // Check if server is running before starting tests
    const serverRunning = await checkServerRunning();
    if (!serverRunning) {
      printServerNotRunningMessage();
      throw new Error('Server is not running. Please start it with: npm start');
    }

    // Launch browser with timeout and headless mode
    vibe = await launchVibiumBrowserWithTimeout({ timeoutMs: 30000 });
  });

  after(async () => {
    if (vibe) {
      try {
        await vibe.quit();
        console.log('[Vibium] Browser closed successfully');
      } catch (error) {
        console.error('[Vibium] Error closing browser:', error);
      }
    }
  });

  test('health endpoint rejects POST method', async () => {
    // Make a POST request to /health which should not be allowed
    const response = await makeHttpRequest('POST', '/health');

    // Express returns 404 for unsupported methods by default
    assert.notStrictEqual(response.statusCode, 200, 'POST method should not return 200');
    assert(response.statusCode === 404 || response.statusCode === 405,
      'POST should return 404 or 405 (Method Not Allowed)');
  });

  test('health endpoint rejects PUT method', async () => {
    const response = await makeHttpRequest('PUT', '/health');

    assert.notStrictEqual(response.statusCode, 200, 'PUT method should not return 200');
    assert(response.statusCode === 404 || response.statusCode === 405,
      'PUT should return 404 or 405 (Method Not Allowed)');
  });

  test('health endpoint rejects DELETE method', async () => {
    const response = await makeHttpRequest('DELETE', '/health');

    assert.notStrictEqual(response.statusCode, 200, 'DELETE method should not return 200');
    assert(response.statusCode === 404 || response.statusCode === 405,
      'DELETE should return 404 or 405 (Method Not Allowed)');
  });

  test('health endpoint rejects PATCH method', async () => {
    const response = await makeHttpRequest('PATCH', '/health');

    assert.notStrictEqual(response.statusCode, 200, 'PATCH method should not return 200');
    assert(response.statusCode === 404 || response.statusCode === 405,
      'PATCH should return 404 or 405 (Method Not Allowed)');
  });

  test('non-existent endpoint returns 404', async () => {
    await vibe.go('http://localhost:3000/nonexistent');
    await new Promise(resolve => setTimeout(resolve, 500));

    const body = await vibe.find('body');
    const bodyText = await body.text();

    // Should show error page, not the health check data
    assert(!bodyText.includes('"status":"ok"'), 'Non-existent endpoint should not return health status');
  });

  test('similar but invalid health endpoint paths return 404', async () => {
    const invalidPaths = ['/healths', '/health/', '/health/status', '/healthcheck'];

    for (const path of invalidPaths) {
      await vibe.go(`http://localhost:3000${path}`);
      await new Promise(resolve => setTimeout(resolve, 300));

      const body = await vibe.find('body');
      const bodyText = await body.text();

      // Should not return the valid health check JSON
      const hasValidHealthJson = bodyText.includes('"status":"ok"') &&
                                  bodyText.includes('"timestamp"');
      assert(!hasValidHealthJson,
        `Invalid path ${path} should not return valid health check data`);
    }
  });

  test('health endpoint with query parameters still works', async () => {
    // Query parameters should be ignored, endpoint should still work
    await vibe.go('http://localhost:3000/health?foo=bar&test=123');
    await new Promise(resolve => setTimeout(resolve, 500));

    const body = await vibe.find('body');
    const bodyText = await body.text();

    if (bodyText && bodyText.length > 0) {
      const jsonContent = JSON.parse(bodyText);
      assert.strictEqual(jsonContent.status, 'ok',
        'Health endpoint should work with query parameters');
      assert(jsonContent.timestamp, 'Timestamp should be present');
    }
  });

  test('health endpoint with invalid Accept header still responds', async () => {
    const response = await makeHttpRequest('GET', '/health', {
      'Accept': 'text/plain'
    });

    // Should still return JSON even with wrong Accept header
    assert.strictEqual(response.statusCode, 200, 'Should return 200 even with wrong Accept header');
    assert(response.data.includes('"status"'), 'Should still return JSON data');
  });

  test('health endpoint handles rapid successive requests', async () => {
    const requests = [];
    const requestCount = 10;

    // Make multiple rapid requests
    for (let i = 0; i < requestCount; i++) {
      requests.push(makeHttpRequest('GET', '/health'));
    }

    const responses = await Promise.all(requests);

    // All requests should succeed
    for (const response of responses) {
      assert.strictEqual(response.statusCode, 200, 'All rapid requests should return 200');
      const data = JSON.parse(response.data);
      assert.strictEqual(data.status, 'ok', 'Each response should have ok status');
      assert(data.timestamp, 'Each response should have timestamp');
    }
  });

  test('health endpoint with very long query string still works', async () => {
    const longQuery = 'a'.repeat(5000);
    await vibe.go(`http://localhost:3000/health?param=${longQuery}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    const body = await vibe.find('body');
    const bodyText = await body.text();

    if (bodyText && bodyText.length > 0) {
      const jsonContent = JSON.parse(bodyText);
      assert.strictEqual(jsonContent.status, 'ok',
        'Health endpoint should handle long query strings');
    }
  });

  test('health endpoint with case variations returns 404', async () => {
    const casedPaths = ['/Health', '/HEALTH', '/hEaLtH'];

    for (const path of casedPaths) {
      await vibe.go(`http://localhost:3000${path}`);
      await new Promise(resolve => setTimeout(resolve, 300));

      const body = await vibe.find('body');
      const bodyText = await body.text();

      // Express is case-sensitive by default, so these should 404
      const hasValidHealthJson = bodyText.includes('"status":"ok"') &&
                                  bodyText.includes('"timestamp"');
      assert(!hasValidHealthJson,
        `Case-varied path ${path} should not return valid health check data`);
    }
  });
});

/**
 * Helper function to make HTTP requests with different methods
 */
function makeHttpRequest(
  method: string,
  path: string,
  headers: Record<string, string> = {}
): Promise<{ statusCode: number; data: string }> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 0,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
