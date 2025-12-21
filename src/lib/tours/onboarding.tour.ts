import type { Tour } from './types';

export const onboardingTour: Tour = {
	name: 'onboarding',
	updatedAt: new Date('2025-12-12T00:00:00Z'),
	steps: () => [
		{
			popover: {
				title: 'Welcome to CarryFit! 🎉',
				description:
					"Let's take a quick tour to help you check if your carry-on luggage meets airline requirements."
			}
		},
		{
			element: '[data-tour-id="bag-input"]',
			popover: {
				title: 'Set your units and size',
				description:
					"Choose metric or imperial, then type in your bag's measurements. Any order is fine - we'll sort it out."
			}
		},
		{
			element: '[data-tour-id="paste-dimensions"]',
			popover: {
				title: 'Quick Input',
				description:
					"Click here to copy-paste bag dimensions directly from product pages or descriptions - we'll automatically detect the measurements!"
			}
		},
		{
			element: '#flexibility',
			popover: {
				title: 'Flexible Bag?',
				description:
					'If your bag is soft-sided and can be squeezed, enable this option to see more potential matches.'
			}
		},
		{
			element: '[data-tour-id="allowance-filter"]',
			popover: {
				title: 'Filter Airlines',
				description:
					'Filter airlines by regions or individual airlines to check compliance. Select specific regions or airlines to see only those in the results below.'
			}
		},
		{
			element: '[data-tour-id="search-input"]',
			popover: {
				title: 'Quick Airline Search',
				description: 'Type airline name to quickly find it in the list.'
			}
		},
		{
			element: '[data-tour-id="policy-link"]',
			popover: {
				title: 'Verify Policies',
				description:
					'Always check the official airline policy before traveling - requirements may change!'
			}
		},
		{
			element: '[data-tour-id="take-tour-button"]',
			popover: {
				title: 'Need a Refresher?',
				description: 'You can restart this tour anytime by clicking this button!'
			}
		}
	]
};
