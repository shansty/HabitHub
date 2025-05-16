import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    tsconfig: './tsconfig.playwright.json',
    testDir: './tests',
    outputDir: 'test-results',
    fullyParallel: true,
    reporter: 'html',

    use: {
        baseURL: 'http://habit-hub-frontend-s3.s3-website.eu-north-1.amazonaws.com',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
