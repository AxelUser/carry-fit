import type { UserPreferences } from '$lib/types';
import { createLocalStore } from '$lib/storage/local-store.svelte';

const STORAGE_KEY = 'carryfit_preferences';

const defaultPreferences: UserPreferences = {
	favoriteAirlines: []
};

export const preferencesStore = createLocalStore<UserPreferences>(STORAGE_KEY, defaultPreferences);
