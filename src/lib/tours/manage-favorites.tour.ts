import type { Tour } from './types';

export const manageFavoritesTour: Tour = {
	name: 'manageFavorites',
	updatedAt: new Date('2025-02-07T00:00:00Z'),
	steps: [
		{
			popover: {
				title: 'Favorite Airlines ⭐',
				description:
					'Save the airlines you fly with frequently to quickly check your luggage compliance!'
			}
		},
		{
			element: '[data-tour-id="favorite-airlines-manage-button"]',
			popover: {
				title: 'Edit Your Favorites List',
				description: 'Click here to manage your most frequently checked airlines.'
			}
		},
		{
			element: '[data-tour-id="favorite-button"]',
			popover: {
				title: 'Quick Favorite Toggle',
				description:
					'Star the airlines you travel with often - you can quickly toggle them directly from the compliance table!'
			}
		},
		{
			element: '[data-tour-id="favorites-only-filter"]',
			popover: {
				title: 'Focus on Your Airlines',
				description: 'Toggle this checkbox to check compliance against your favorite airlines only.'
			}
		}
	]
};
