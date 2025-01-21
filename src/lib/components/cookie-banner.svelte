<script lang="ts">
	import { cookieConsent } from '$lib/stores/cookie-consent.svelte';
	import { analyticsService } from '$lib/analytics';
	import { links } from '$lib/utils/navigation';

	let showBanner = $state(false);

	// Show banner only if consent hasn't been given yet
	$effect(() => {
		if (cookieConsent.isLoaded) {
			showBanner = cookieConsent.value.timestamp === null;
		}
	});

	function acceptAll() {
		cookieConsent.value = {
			analytics: true,
			necessary: true,
			timestamp: new Date().toISOString()
		};
		analyticsService.updateConsent(true);
		showBanner = false;
	}

	function acceptNecessary() {
		cookieConsent.value = {
			analytics: false,
			necessary: true,
			timestamp: new Date().toISOString()
		};
		analyticsService.updateConsent(false);
		showBanner = false;
	}
</script>

{#if showBanner}
	<div class="fixed inset-0 z-[100] bg-black/20">
		<div class="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-xl ring-1 ring-sky-100">
			<div class="mx-auto max-w-7xl">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div class="prose prose-sm prose-sky">
						<p>
							We use cookies to improve your experience. By continuing to use our site, you agree to
							our
							<a href={links.legal.privacy} class="font-medium text-sky-600 hover:underline"
								>Privacy Policy</a
							>.
						</p>
						<p class="mt-1 text-xs text-sky-600/80">
							You can change your preferences anytime on our
							<a href={links.legal.optOut} class="font-medium hover:underline">opt-out page</a>.
						</p>
					</div>
					<div class="flex flex-wrap gap-2">
						<button
							type="button"
							onclick={acceptNecessary}
							class="rounded-md px-4 py-2 text-sm font-medium text-sky-600 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
						>
							Necessary Only
						</button>
						<button
							type="button"
							onclick={acceptAll}
							class="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
						>
							Accept All Cookies
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
