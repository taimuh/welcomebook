import { defineConfig, devices } from '@playwright/test';

// E2Eテスト用の分離ポート（開発中のStrapiと競合しないよう別ポートを使用）
const MOCK_PORT = 1338;
const E2E_PORT = 3001;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${E2E_PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: [
    {
      command: 'node tests/e2e/mock-strapi-server.mjs',
      url: `http://localhost:${MOCK_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 10000,
      env: { MOCK_PORT: String(MOCK_PORT) },
    },
    {
      command: `npm run dev -- -p ${E2E_PORT}`,
      url: `http://localhost:${E2E_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      env: {
        NEXT_PUBLIC_STRAPI_URL: `http://localhost:${MOCK_PORT}`,
      },
    },
  ],
});
