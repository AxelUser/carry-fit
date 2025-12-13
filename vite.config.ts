import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
	plugins: [sveltekit(), qrcode()],
	optimizeDeps: {
		include: [
			'posthog-js',
			'tailwind-variants',
			'clsx',
			'tailwind-merge',
			'driver.js',
			'mode-watcher',
			'bits-ui',
			'svelte-virtuallists'
		]
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
