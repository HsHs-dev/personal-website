import { defineConfig } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export default defineConfig({
  testDir: './tests/browser',
  outputDir: join(tmpdir(), 'hds-door-test-results'),
  workers: 1,
  timeout: 30_000,
  use: { channel: 'chrome', baseURL: 'http://127.0.0.1:5176', viewport: { width: 1440, height: 1100 } },
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 5176 --strictPort', url: 'http://127.0.0.1:5176', reuseExistingServer: false },
});
