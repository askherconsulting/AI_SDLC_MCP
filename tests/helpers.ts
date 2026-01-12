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

/**
 * Launch Vibium browser with a timeout and optional headless mode
 * @param options - Options for browser launch
 * @param options.timeoutMs - Timeout in milliseconds (default: 10000)
 * @param options.headless - Whether to run in headless mode (default: false, or true if CI environment detected)
 * @returns Promise that resolves to the browser instance
 */
export async function launchVibiumBrowserWithTimeout(options: { timeoutMs?: number; headless?: boolean } = {}): Promise<Awaited<ReturnType<typeof import('vibium').browser.launch>>> {
  const { browser } = await import('vibium');
  const { timeoutMs = 10000, headless } = options;
  
  // Default to headless in CI environments
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  const shouldRunHeadless = headless !== undefined ? headless : isCI;
  
  // Try launching with headless option, fallback to no options if not supported
  const launchBrowser = async () => {
    try {
      // Try with headless option first
      return await browser.launch({ headless: shouldRunHeadless });
    } catch (error: any) {
      // If headless option is not supported, try without options
      if (shouldRunHeadless && (error?.message?.includes('headless') || error?.code)) {
        console.warn('Vibium may not support headless option, trying without it...');
        return await browser.launch();
      }
      throw error;
    }
  };
  
  return Promise.race([
    launchBrowser(),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Vibium browser launch timed out after ${timeoutMs}ms. This may indicate browser installation issues or CI environment problems.`));
      }, timeoutMs);
    })
  ]);
}