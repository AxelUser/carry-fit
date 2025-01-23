import { createLocalStore } from '$lib/storage/local-store.svelte';
import type { CookieConsent } from '$lib/types';

export const cookieConsent = createLocalStore<CookieConsent>('cookie-consent', {
	analytics: false,
	necessary: true,
	timestamp: null
});
