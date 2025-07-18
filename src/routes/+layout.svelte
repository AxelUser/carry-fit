<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { metrics, updateConsent } from '$lib/analytics';
	import '../app.css';
	import { AlertTriangle } from 'lucide-svelte';
	import { CarryFitIcon } from '$lib/components/icons';
	import UltraWideJoke from '$lib/components/misc/ultra-wide-joke.svelte';
	import { CookieBanner, ToggleTheme } from '$lib/components/misc';
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
<div class="pointer-events-none fixed top-4 z-50 w-full">
	<div class="mx-auto max-w-[1700px] px-4">
		<div class="flex justify-end">
			<div class="pointer-events-auto">
				<ToggleTheme />
			</div>
		</div>
	</div>
</div>
<CookieBanner
	onAccept={handleConsent}
	showBanner={cookieConsent.isLoaded && cookieConsent.value.timestamp === null}
/>

{#if error}
	<div class="min-h-screen px-2 py-8 sm:px-4">
		<div class="min-h-scree">
			<div class="mx-auto md:container">
				<div class="mb-12 py-2 text-center">
					<h1 class="mb-3 font-extrabold">
						<span
							class="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-4xl text-transparent sm:text-6xl"
						>
							CarryFit
						</span>
						<span class="ml-0 inline-flex translate-y-2">
							<CarryFitIcon class="h-12 w-12 sm:h-16 sm:w-16" />
						</span>
					</h1>
				</div>

				<div class="mx-auto max-w-2xl rounded-xl p-8 shadow-xl ring-1 ring-primary/10">
					<div class="mb-6 flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10"
						>
							<AlertTriangle class="h-6 w-6 text-destructive" />
						</div>
						<div>
							<h2 class="mb-2 text-xl font-semibold text-destructive">
								Oops! Our code took an unexpected vacation 🏖️
							</h2>
							<p class="mb-4 text-destructive">
								{error?.message ||
									"Looks like our pixels got a bit tangled. Don't worry, they're just having a bad hair day!"}
							</p>
						</div>
					</div>

					<div class="rounded-lg border border-primary/10 bg-primary/10 p-6">
						<h3 class="mb-3 font-medium text-primary">Want to help catch this bug? Here's how:</h3>
						<ul class="ml-2 space-y-2 text-sm text-primary">
							<li>
								• File a bug report on <a
									href="https://github.com/AxelUser/carry-fit"
									class="text-primary hover:underline"
									target="_blank"
									rel="noopener noreferrer">GitHub</a
								> (our bug collection gallery)
							</li>
							<li>
								• Send a friendly email to <a
									href="mailto:aleksey@maltsev.space"
									class="text-primary hover:underline">aleksey@maltsev.space</a
								>
							</li>
							<li>
								• Tweet at me on <a
									href="https://x.com/axel_user"
									class="text-primary hover:underline"
									target="_blank"
									rel="noopener noreferrer">X (Twitter)</a
								> - I promise I don't byte! 🤓
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
