import type { UserPreferences, MeasurementSystem } from '$lib/types';
import { createLocalStore } from '$lib/storage/local-store.svelte';

const STORAGE_KEY = 'carryfit_preferences';

const defaultPreferences: UserPreferences = {
	favoriteAirlines: [],
	measurementSystem: 'metric' as MeasurementSystem
};

let preferencesStore = createLocalStore<UserPreferences>(
	STORAGE_KEY,
	defaultPreferences,
	(loaded, initial) => {
		return {
			...initial,
			...loaded
		};
	}
);

// Create a preferences object with reactive getters/setters
export default {
	get measurementSystem() {
		return preferencesStore.value.measurementSystem;
	},
	set measurementSystem(system: MeasurementSystem) {
		preferencesStore.value = {
			...preferencesStore.value,
			measurementSystem: system
		};
	},

	get favoriteAirlines() {
		return preferencesStore.value.favoriteAirlines;
	},
	set favoriteAirlines(airlines: string[]) {
		preferencesStore.value = {
			...preferencesStore.value,
			favoriteAirlines: airlines
		};
	}
};
