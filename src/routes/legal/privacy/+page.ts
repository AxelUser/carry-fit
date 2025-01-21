import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		title: 'Privacy Policy',
		lastUpdated: new Date('2025-01-21')
	};
};
