import * as http from 'http';

/**
 * Check if the server is running on the specified URL
 * @param url - The URL to check (default: http://localhost:3000/health)
 * @returns Promise<boolean> - true if server is reachable, false otherwise
 */
export async function checkServerRunning(url: string = 'http://localhost:3000/health'): Promise<boolean> {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, (res) => {
      resolve(res.statusCode !== undefined && res.statusCode < 500);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

/**
 * Print a helpful message if the server is not running
 */
export function printServerNotRunningMessage(): void {
  console.error('\n' + '='.repeat(70));
  console.error('⚠️  SERVER NOT RUNNING');
  console.error('='.repeat(70));
  console.error('All tests failed because the server is not accessible.');
  console.error('');
  console.error('Please start the server first by running:');
  console.error('  npm start');
  console.error('');
  console.error('Then run the tests again in a separate terminal:');
  console.error('  npm test');
  console.error('='.repeat(70) + '\n');
}

/**
 * Print a helpful message if Playwright browsers are not installed
 */
export function printPlaywrightBrowserInstallMessage(): void {
  console.error('\n' + '='.repeat(70));
  console.error('⚠️  PLAYWRIGHT BROWSERS NOT INSTALLED');
  console.error('='.repeat(70));
  console.error('Playwright tests failed because the browser binaries are not installed.');
  console.error('');
  console.error('Please install Playwright browsers by running:');
  console.error('  npx playwright install');
  console.error('');
  console.error('Then run the tests again:');
  console.error('  npm run test:playwright');
  console.error('='.repeat(70) + '\n');
}