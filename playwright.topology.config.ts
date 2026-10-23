import { defineConfig, devices } from 'playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'backup-topology.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['html', { outputFolder: 'playwright-report/backup-topology', open: 'never' }]],
  outputDir: 'playwright-report/backup-topology/results',
  use: {
    baseURL: 'http://127.0.0.1:3726', trace: 'retain-on-failure', screenshot: 'only-on-failure',
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
  },
  webServer: {
    command: 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3726',
    url: 'http://127.0.0.1:3726/projects/backup-topology',
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'ios', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
  ],
})
