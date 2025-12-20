import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { qrcode } from 'vite-plugin-qrcode';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), qrcode()],
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
