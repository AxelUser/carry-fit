import type { Tour } from './types';

export const onboardingTour: Tour = {
	name: 'onboarding',
	updatedAt: new Date('2025-02-03T00:00:00Z'),
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
			element: '[data-tour-id="bag-input"]',
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
			element: '[data-tour-id="regions-filter-list"]',
			popover: {
				title: 'Filter by Region',
				description: 'Focus on specific regions to find relevant airlines.'
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
			element: '[data-tour-id="favorite-button"]',
			popover: {
				title: 'Save Favorites',
				description: 'Star your frequently used airlines to quickly find them later.'
			}
		},
		{
			element: '[data-tour-id="favorite-airlines-manage-button"]',
			popover: {
				title: 'Manage Favorite Airlines',
				description: 'You can also edit your favorite airlines list here.'
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
