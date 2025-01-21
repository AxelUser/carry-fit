import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		title: 'Terms of Use',
		lastUpdated: new Date('2025-01-13')
	};
};
