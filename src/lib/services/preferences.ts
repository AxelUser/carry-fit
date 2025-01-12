import type { UserPreferences } from '$lib/types';
import { createLocalStore } from '$lib/storage/local-store.svelte';

const STORAGE_KEY = 'carryfit_preferences';

const defaultPreferences: UserPreferences = {
	favoriteAirlines: []
};

const store = createLocalStore(STORAGE_KEY, defaultPreferences);

function loadPreferences(): UserPreferences {
	return store.value;
}

function savePreferences(preferences: UserPreferences) {
	store.value = preferences;
}

function resetPreferences() {
	store.reset();
}

export const preferencesService = {
	loadPreferences,
	savePreferences,
	resetPreferences
};
