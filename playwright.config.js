// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
/**
 * @see https://playwright.dev/docs/test-configuration
 */
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
module.exports = defineConfig({
  testDir: './tests',
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.STAGING === '1' ? 'https://cdpn.io/pen/debug/WNPVoag' : 'http://localhost:3000',
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    headless: false,
    launchOptions: {
      slowMo: 500
    },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10000,
    navigationTimeout: 10000,
  },
  outputDir: "test-results/",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'javascript-disabled',
      use: { javaScriptEnabled: false },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});

