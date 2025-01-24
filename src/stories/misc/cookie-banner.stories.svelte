<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { CookieBanner } from '$lib/components/misc';
	import type { CookieConsent } from '$lib/types';

	const { Story } = defineMeta({
		title: 'Misc/CookieBanner',
		component: CookieBanner,
		parameters: {
			docs: {
				description: {
					component:
						'Cookie consent banner that allows users to accept all cookies or only necessary cookies. The banner appears if no consent has been given yet.'
				}
			}
		},
		argTypes: {
			showBanner: {
				description: 'Controls the visibility of the banner',
				control: 'boolean'
			},
			onAccept: {
				description: 'Callback function when user accepts cookies',
				action: 'onAccept'
			}
		}
	});

	const mockData = {
		showBanner: true,
		onAccept: (consent: CookieConsent) => {
			alert(`Consent given: ${JSON.stringify(consent, null, 2)}`);
		}
	};
</script>

<Story name="Default" args={mockData} />
