import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		title: 'Analytics Preferences',
		lastUpdated: null
	};
};
