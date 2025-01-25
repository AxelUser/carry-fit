<script lang="ts">
	import { links } from '$lib/utils/navigation';
	import type { CookieConsent } from '$lib/types';
	import { Button } from '../ui/button';

	interface Props {
		onAccept: (consent: CookieConsent) => void;
		showBanner: boolean;
	}

	let { onAccept, showBanner }: Props = $props();

	function acceptAll() {
		onAccept({
			analytics: true,
			necessary: true,
			timestamp: new Date().toISOString()
		});
		showBanner = false;
	}

	function acceptNecessary() {
		onAccept({
			analytics: false,
			necessary: true,
			timestamp: new Date().toISOString()
		});
		showBanner = false;
	}
</script>

{#if showBanner}
	<div class="fixed inset-0 z-[100] bg-black/20">
		<div class="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-xl ring-1 ring-sky-100">
			<div class="mx-auto max-w-7xl">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div class="text-base text-sky-900">
						<p>
							We use cookies to improve your experience. By continuing to use our site, you agree to
							our
							<a href={links.legal.privacy} class="font-medium text-sky-600 hover:underline"
								>Privacy Policy</a
							>.
						</p>
						<p class="mt-1 text-sm">
							You can change your preferences anytime on our
							<a href={links.legal.optOut} class="font-medium text-sky-600 hover:underline"
								>opt-out page</a
							>.
						</p>
					</div>
					<div class="flex flex-wrap gap-2">
						<Button
							variant="ghost"
							data-testid="accept-necessary-cookies"
							type="button"
							onclick={acceptNecessary}
						>
							Necessary Only
						</Button>
						<Button data-testid="accept-all-cookies" type="button" onclick={acceptAll}>
							Accept All Cookies
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
