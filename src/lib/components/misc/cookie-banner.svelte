<script lang="ts">
	import { links } from '$lib/utils/navigation';
	import type { CookieConsent } from '$lib/types';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

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

<AlertDialog.Root bind:open={showBanner}>
	<AlertDialog.Content
		class="sm:max-w-[500px]"
		escapeKeydownBehavior="ignore"
		interactOutsideBehavior="ignore"
	>
		<AlertDialog.Header>
			<AlertDialog.Title>Cookie Preferences</AlertDialog.Title>
			<AlertDialog.Description class="text-left text-sm">
				<p>
					We use cookies to improve your experience. By continuing to use our site, you agree to our
					<a
						href={links.legal.privacy}
						class="whitespace-nowrap font-medium text-primary hover:underline">Privacy Policy</a
					>. You can change your preferences anytime on our
					<a
						href={links.legal.optOut}
						class="whitespace-nowrap font-medium text-primary hover:underline">opt-out page</a
					>.
				</p>
			</AlertDialog.Description>
		</AlertDialog.Header>

		<AlertDialog.Footer class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-start">
			<AlertDialog.Cancel data-testid="accept-necessary-cookies" onclick={acceptNecessary}>
				Necessary Only
			</AlertDialog.Cancel>
			<AlertDialog.Action autofocus={true} data-testid="accept-all-cookies" onclick={acceptAll}>
				Accept All Cookies
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
