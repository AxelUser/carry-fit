import { defineConfig } from '@playwright/test';

// Get port from env or use default
const PORT = process.env.PORT || 5173;
const isCI = process.env.CI !== undefined;

// Determine if we're running manual tests
const grepInvert = process.env.GREP_INVERT === '1';
const grepManual = process.env.GREP === '@manual';
const isManualTest = grepManual && !grepInvert;

export default defineConfig({
	testDir: 'e2e',
	reporter: [['html'], [isCI ? 'github' : 'list']],
	use: {
		baseURL: `http://localhost:${PORT}`,
		screenshot: 'only-on-failure'
	},
	retries: 1,
	webServer: isManualTest
		? undefined
		: {
				command: !isCI ? `pnpm dev --port ${PORT}` : `pnpm build && pnpm preview --port ${PORT}`,
				port: Number(PORT),
				reuseExistingServer: !isCI,
				timeout: 120000, // 2 minutes
				stdout: 'pipe',
				stderr: 'pipe',
				env: {
					PUBLIC_POSTHOG_API_KEY: '123'
				}
			}
});
