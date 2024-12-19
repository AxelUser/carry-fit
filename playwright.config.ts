import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	reporter: [
		['html'],
		['list']
	],
	use: {
		screenshot: 'only-on-failure',
	},
	retries: 1
});
