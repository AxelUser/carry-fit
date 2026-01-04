<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { metrics, updateConsent } from '$lib/analytics';
	import '../app.css';
	import { AlertTriangle } from '@lucide/svelte';
	import { CarryFitIcon } from '$lib/components/icons';
	import UltraWideJoke from '$lib/components/misc/ultra-wide-joke.svelte';
	import { CookieBanner } from '$components/cookie-banner';
	import { Header, Footer } from '$lib/components/layout';
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

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1">
		{#if error}
			<div class="min-h-screen px-2 py-8 sm:px-4">
				<div class="min-h-scree">
					<div class="mx-auto md:container">
						<div class="mb-12 py-2 text-center">
							<h1 class="mb-3 font-extrabold">
								<span
									class="bg-linear-to-r from-blue-700 to-sky-500 bg-clip-text text-4xl text-transparent sm:text-6xl"
								>
									CarryFit
								</span>
								<span class="ml-0 inline-flex translate-y-2">
									<CarryFitIcon class="h-12 w-12 sm:h-16 sm:w-16" />
								</span>
							</h1>
						</div>

						<div class="ring-primary/10 mx-auto max-w-2xl rounded-xl p-8 shadow-xl ring-1">
							<div class="mb-6 flex items-start gap-4">
								<div
									class="bg-destructive/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
								>
									<AlertTriangle class="text-destructive h-6 w-6" />
								</div>
								<div>
									<h2 class="text-destructive mb-2 text-xl font-semibold">
										Oops! Our code took an unexpected vacation 🏖️
									</h2>
									<p class="text-destructive mb-4">
										{error?.message ||
											"Looks like our pixels got a bit tangled. Don't worry, they're just having a bad hair day!"}
									</p>
								</div>
							</div>

							<div class="border-primary/10 bg-primary/10 rounded-lg border p-6">
								<h3 class="text-primary mb-3 font-medium">
									Want to help catch this bug? Here's how:
								</h3>
								<ul class="text-primary ml-2 space-y-2 text-sm">
									<li>
										• File a bug report on <a
											href="https://github.com/AxelUser/carry-fit/issues"
											class="text-primary hover:underline"
											target="_blank"
											rel="noopener noreferrer">GitHub issues</a
										>
									</li>
									<li>
										• Send a friendly email to <a
											href="mailto:aleksey@maltsev.space"
											class="text-primary hover:underline">aleksey@maltsev.space</a
										>
									</li>
									<li>
										• Tweet or DM me on <a
											href="https://x.com/axel_user"
											class="text-primary hover:underline"
											target="_blank"
											rel="noopener noreferrer">X (Twitter)</a
										> - yes I sit here, but I'm not toxic! 🤓
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			{@render children()}
		{/if}
	</main>
	<Footer />
</div>
