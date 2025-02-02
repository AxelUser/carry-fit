import type { Tour } from './types';

export const newUserTour: Tour = {
	steps: () => [
		{
			popover: {
				title: 'Welcome to CarryFit! 🎉',
				description:
					"Let's take a quick tour to help you check if your carry-on luggage meets airline requirements."
			}
		},
		{
			element: '[data-tour-id="measurement-system-select"]',
			popover: {
				title: 'Choose Your Units',
				description:
					'Start by selecting your preferred measurement system - Metric (cm/kg) or Imperial (in/lb).'
			}
		},
		{
			element: '#height',
			popover: {
				title: 'Enter Bag Dimensions',
				description:
					"Input your bag's measurements. Don't worry about the order - we'll find the best fit!"
			}
		},
		{
			element: '[data-tour-id="paste-dimensions"]',
			popover: {
				title: 'Quick Input',
				description:
					"Copy-paste bag dimensions directly from product pages or descriptions - we'll automatically detect the measurements!"
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
			element: '[data-tour-id="regions-filter-list"]',
			popover: {
				title: 'Filter by Region',
				description: 'Focus on specific regions to find relevant airlines.'
			}
		},
		{
			element: '[data-tour-id="favorite-button"]',
			popover: {
				title: 'Save Favorites',
				description: 'Star your frequently used airlines to quickly find them later.'
			}
		},
		{
			element: '[data-tour-id="policy-link"]',
			popover: {
				title: 'Verify Policies',
				description:
					'Always check the official airline policy before traveling - requirements may change!'
			}
		}
	]
};
