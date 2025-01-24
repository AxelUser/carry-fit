<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { CookieBanner } from '$lib/components/misc';
	import type { CookieConsent } from '$lib/types';
	import { AbsoluteLayoutDecorator } from '../decorators';

	const { Story } = defineMeta({
		title: 'Misc/CookieBanner',
		component: CookieBanner,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Cookie consent banner that allows users to accept all cookies or only necessary cookies. The banner appears if no consent has been given yet.'
				}
			},
			story: {
				inline: false,
				iframeHeight: 400
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
		},
		// @ts-expect-error - Decorator type mismatch
		decorators: [() => AbsoluteLayoutDecorator]
	});

	const mockData = {
		showBanner: true,
		onAccept: (consent: CookieConsent) => {
			alert(`Consent given: ${JSON.stringify(consent, null, 2)}`);
		}
	};
</script>

<Story name="Default" args={mockData} />
