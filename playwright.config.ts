import { defineConfig, devices } from '@playwright/test';

const FIREBASE_URL = 'https://motivation-catalyst-david.web.app';
const LOCAL_URL = 'http://localhost:5188';

// Default to localhost for local testing, Firebase URL for CI
const baseURL = process.env.BASE_URL || (process.env.CI ? FIREBASE_URL : LOCAL_URL);
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(baseURL);

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { open: 'always' }]],
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    // Only start the dev server when testing against localhost
    webServer: isLocal ? {
        command: 'npm run dev -- --port 5188',
        url: 'http://localhost:5188',
        reuseExistingServer: !process.env.CI,
        stdout: 'ignore',
        stderr: 'pipe',
    } : undefined,
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
