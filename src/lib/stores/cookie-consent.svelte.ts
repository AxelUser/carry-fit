import { createLocalStore } from '$lib/storage/local-store.svelte';

export interface CookieConsent {
	analytics: boolean;
	necessary: boolean;
	timestamp: string | null;
}

export const cookieConsent = createLocalStore<CookieConsent>('cookie-consent', {
	analytics: false,
	necessary: true,
	timestamp: null
});
