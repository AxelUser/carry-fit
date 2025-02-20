import type { Tour } from './types';

export const airlineSearchTour: Tour = {
	name: 'airlineSearch',
	updatedAt: new Date('2025-02-03T00:00:00Z'),
	steps: [
		{
			popover: {
				title: 'Quick Airline Search 🔍',
				description: 'No more scrolling! Let us help you find your airline in seconds.'
			}
		},
		{
			element: '[data-tour-id="search-input"]',
			popover: {
				title: 'Quick Airline Search 🔍',
				description: 'Type airline name to quickly find it in the list.'
			}
		}
	]
};
