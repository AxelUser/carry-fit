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
	reporter: [['html'], ['list']],
	use: {
		baseURL: `http://localhost:${PORT}`,
		screenshot: 'only-on-failure'
	},
	retries: 1,
	webServer: isManualTest
		? undefined
		: {
				command: `pnpm dev --port ${PORT}`,
				port: Number(PORT),
				reuseExistingServer: !isCI,
				timeout: 120000, // 2 minutes
				stdout: 'pipe',
				stderr: 'pipe'
			}
});
