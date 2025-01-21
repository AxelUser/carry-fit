<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { base } from '$app/paths';

	const lastUpdated = new Date('2025-01-21');
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
				class="mb-6 bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
			>
				Privacy Policy
			</h1>

			<div class="prose prose-sky max-w-none space-y-8">
				<p class="text-sm text-sky-600">Last updated: {lastUpdated.toLocaleDateString()}</p>

				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-sky-900 sm:text-2xl">Overview</h2>
					<p class="text-sky-800">
						CarryFit ("we", "us", or "our") is committed to protecting your privacy. This Privacy
						Policy explains how we collect, use, and safeguard your information when you use our
						website.
					</p>
				</div>

				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-sky-900 sm:text-2xl">Cookie Usage</h2>
					<p class="text-sky-800">We use two types of cookies on our website:</p>
					<ul class="list-disc space-y-2 pl-5 text-sky-800">
						<li>
							<strong>Necessary Cookies:</strong> These are essential for the website to function
							properly and remember your preferences. They include:
							<ul class="mt-2 list-disc space-y-1 pl-5">
								<li>User preferences (measurement system, favorite airlines)</li>
								<li>Feature discovery data (which new features you've seen)</li>
								<li>Changelog information (last viewed updates)</li>
							</ul>
							<p class="mt-2">
								These cookies are stored in your browser's local storage to maintain your
								preferences between visits. They don't collect any personal information and only
								store the settings you choose while using our website.
							</p>
						</li>
						<li>
							<strong>Analytics Cookies:</strong> These help us understand how visitors interact with
							our website through PostHog analytics. You can choose to enable or disable these cookies
							through our cookie consent banner.
						</li>
					</ul>
					<p class="text-sky-800">
						When you choose "Necessary Only", we use memory-only storage which means all tracking
						data is cleared when you close the website. If you accept analytics cookies, the data
						will be stored in your browser's local storage and cookies to provide more accurate
						analytics.
					</p>
				</div>

				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-sky-900 sm:text-2xl">Information We Collect</h2>
					<p class="text-sky-800">
						Through PostHog analytics, we may collect the following anonymous usage data:
					</p>
					<ul class="list-disc space-y-1 pl-5 text-sky-800">
						<li>Pages visited and time spent on the website</li>
						<li>Browser type and version</li>
						<li>Operating system</li>
						<li>Interaction data (e.g., button clicks, form submissions)</li>
						<li>General location data</li>
					</ul>
					<p class="text-sky-800">
						This data collection is optional and depends on your cookie preferences.
					</p>
				</div>

				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-sky-900 sm:text-2xl">
						How We Use Your Information
					</h2>
					<p class="text-sky-800">The collected analytics data is used solely for:</p>
					<ul class="list-disc space-y-1 pl-5 text-sky-800">
						<li>Understanding how users interact with our website</li>
						<li>Improving user experience</li>
						<li>Identifying and fixing technical issues</li>
						<li>Making data-driven decisions about feature development</li>
					</ul>
				</div>

				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-sky-900 sm:text-2xl">Your Privacy Choices</h2>
					<p class="text-sky-800">You have full control over your privacy preferences:</p>
					<ul class="list-disc space-y-1 pl-5 text-sky-800">
						<li>Choose between necessary-only or analytics cookies through our consent banner</li>
						<li>Change your preferences at any time by clearing your browser data</li>
						<li>Use browser privacy features or extensions to block analytics scripts</li>
						<li>No personal identifiable information is ever collected or stored</li>
					</ul>
				</div>

				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-sky-900 sm:text-2xl">Changes to This Policy</h2>
					<p class="text-sky-800">
						We may update this Privacy Policy from time to time. We will notify you of any changes
						by posting the new Privacy Policy on this page and updating the "Last updated" date.
					</p>
				</div>

				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-sky-900 sm:text-2xl">Contact Us</h2>
					<p class="text-sky-800">
						If you have any questions about this Privacy Policy, please contact us at <a
							href="mailto:alexey.maltsev.work@gmail.com"
							class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
							>alexey.maltsev.work@gmail.com</a
						>.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
