import { initAnalytics } from '$lib/analytics';
import type { ClientInit } from '@sveltejs/kit';
import { cookieConsent } from '$lib/stores/cookie-consent.svelte';
export const init: ClientInit = async () => {
	initAnalytics(cookieConsent.value.analytics);
};
