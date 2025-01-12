import { createLocalStore } from '$lib/storage/local-store.svelte';

export const FEATURES = {
	favorites: 'favorites'
} as const;

interface FeatureUsage {
	[FEATURES.favorites]?: boolean;
}

const STORAGE_KEY = 'carryfit_feature_usage';

const store = createLocalStore<FeatureUsage>(STORAGE_KEY, {});

export const featureUsageService = {
	markFeatureAsUsed(feature: keyof typeof FEATURES) {
		store.value = { ...store.value, [feature]: true };
	},

	isFeatureUsed(feature: keyof typeof FEATURES): boolean {
		return !!store.value[feature];
	}
};
