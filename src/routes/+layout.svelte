<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { metrics, updateConsent } from '$lib/analytics';
	import '../app.css';
	import { UltraWideJoke } from '$components/easter-eggs';
	import { CookieBanner } from '$components/cookie-banner';
	import { MainLayout } from '$components/layout';
	import type { CookieConsent } from '$lib/types';
	import { cookieConsent } from '$lib/stores/cookie-consent.svelte';
	let { children } = $props();
	let error = $state<Error | null>(null);

	function handleError(e: Event) {
		if (e instanceof ErrorEvent) {
			error = e.error;
		}
		metrics.errorOccurred(error);
	}

	function handleConsent(consent: CookieConsent) {
		cookieConsent.value = consent;
		updateConsent(consent.analytics);
	}
</script>

<svelte:window on:error={handleError} />

<UltraWideJoke />
<ModeWatcher />
<CookieBanner
	onAccept={handleConsent}
	showBanner={cookieConsent.isLoaded && cookieConsent.value.timestamp === null}
/>

<MainLayout errorMessage={error?.message}>
	{@render children()}
</MainLayout>
