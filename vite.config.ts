import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
	plugins: [sveltekit(), qrcode()],
	test: {
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
