<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { cookieConsent } from '$lib/stores/cookie-consent.svelte';
	import { posthogAnalytics } from '$lib/analytics/posthog-analytics';

	let success = $state(false);
	const isOptedIn = $derived(cookieConsent.value.analytics);

	function toggleAnalytics() {
		cookieConsent.value = {
			analytics: !cookieConsent.value.analytics,
			necessary: true,
			timestamp: new Date().toISOString()
		};
		posthogAnalytics.updateConsent(cookieConsent.value.analytics);
		success = true;
	}
</script>

<div class="min-h-screen px-2 py-8 sm:px-4">
	<div class="mx-auto max-w-3xl">
		<div class="mb-8">
			<a
				href="{base}/"
				class="inline-flex items-center gap-2 rounded-lg bg-white/95 px-4 py-2 text-sky-700 shadow-md ring-1 ring-sky-100 transition-colors hover:bg-sky-50"
			>
				<ArrowLeft class="h-4 w-4" />
				<span>Back to CarryFit</span>
			</a>
		</div>

		<div class="rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100">
			<h1
				class="mb-8 bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text pb-1 text-3xl font-bold text-transparent sm:text-4xl"
			>
				Analytics Preferences
			</h1>

			<div class="prose prose-sky max-w-none space-y-8">
				<div class="space-y-4">
					<p class="text-sky-800">
						Control your privacy settings for analytics. Current status:
						<span class="font-medium">
							{isOptedIn ? 'Analytics Cookies Enabled' : 'Analytics Cookies Disabled'}
						</span>
					</p>
					<ul class="list-disc space-y-1 pl-5 text-sky-800">
						<li>
							{isOptedIn
								? 'Your visits are tracked between page reloads and future visits on this device'
								: 'All tracking data is cleared after each page reload - visits are completely anonymous'}
						</li>
						<li>
							{isOptedIn
								? 'We collect anonymous usage data like page views, interactions, and features used'
								: 'Basic analytics are collected but cleared when you leave or reload the page'}
						</li>
						<li>We never collect or store any personally identifiable information</li>
					</ul>

					{#if success}
						<div
							class="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
							role="alert"
						>
							<p class="font-medium">
								Successfully {isOptedIn
									? 'enabled analytics cookies'
									: 'disabled analytics cookies'}!
							</p>
							<p class="mt-2">
								Your preference has been saved and will be remembered for future visits.
							</p>
						</div>
					{/if}

					<div class="mt-6">
						<button
							onclick={toggleAnalytics}
							class="rounded-lg {isOptedIn
								? 'border border-sky-600 bg-white text-sky-600 hover:bg-sky-50'
								: 'bg-sky-600 text-white hover:bg-sky-700'} px-4 py-2 text-sm font-medium shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
						>
							{isOptedIn ? 'Disable Analytics Cookies' : 'Enable Analytics Cookies'}
						</button>
					</div>
				</div>

				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-sky-900 sm:text-2xl">Additional Information</h2>
					<p class="text-sky-800">
						For more information about our privacy practices, please read our <a
							href="/privacy"
							class="font-medium text-sky-600 hover:text-sky-800 hover:underline">Privacy Policy</a
						>.
					</p>
					<p class="text-sky-800">
						If you have any questions or concerns, please contact us at <a
							href="mailto:alexey.maltsev.work@gmail.com"
							class="font-medium text-sky-600 hover:text-sky-800 hover:underline"
							>alexey.maltsev.work@gmail.com</a
						>.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
