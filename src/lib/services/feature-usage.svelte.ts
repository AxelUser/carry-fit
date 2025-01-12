import { createLocalStore } from '$lib/storage/local-store.svelte';

const FEATURES = {
	favorites: 'favorites'
} as const;

interface FeatureUsage {
	[FEATURES.favorites]?: boolean;
}

const STORAGE_KEY = 'carryfit_feature_usage';

let store = createLocalStore<FeatureUsage>(STORAGE_KEY, {});

export function favoritesUsageStore() {
	let isFavoritesUsed = $derived(store.isLoaded ? !!store.value[FEATURES.favorites] : true);

	return {
		get used() {
			return isFavoritesUsed;
		},
		markAsUsed() {
			store.value = {
				...store.value,
				[FEATURES.favorites]: true
			};
		}
	};
}
