<script lang="ts">
	import { cookieConsent } from '$lib/stores/cookie-consent.svelte';
	import { updateConsent } from '$lib/analytics';
	import { links } from '$lib/utils/navigation';
	import { Button } from '$lib/components/ui/button';

	let success = $state(false);
	const isOptedIn = $derived(cookieConsent.value.analytics);

	function toggleAnalytics() {
		cookieConsent.value = {
			analytics: !cookieConsent.value.analytics,
			necessary: true,
			timestamp: new Date().toISOString()
		};
		updateConsent(cookieConsent.value.analytics);
		success = true;
	}
</script>

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
	<div class="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800" role="alert">
		<p class="font-medium">
			Successfully {isOptedIn ? 'enabled analytics cookies' : 'disabled analytics cookies'}!
		</p>
		<p class="mt-2">Your preference has been saved and will be remembered for future visits.</p>
	</div>
{/if}

<div class="mt-6">
	<Button variant={isOptedIn ? 'outline' : 'primary'} onclick={toggleAnalytics}>
		{isOptedIn ? 'Disable Analytics Cookies' : 'Enable Analytics Cookies'}
	</Button>
</div>

<div class="space-y-4">
	<h2 class="text-xl font-semibold text-sky-900 sm:text-2xl">Additional Information</h2>
	<p class="text-sky-800">
		For more information about our privacy practices, please read our <a
			href={links.legal.privacy}
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
