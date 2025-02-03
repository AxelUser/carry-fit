import { createLocalStore } from '$lib/storage/local-store.svelte';

const versionStore = createLocalStore<string | null>('lastSeenVersion', null);

export default {
	get lastSeenVersion(): Date | null {
		try {
			return versionStore.value ? new Date(versionStore.value) : null;
		} catch (error) {
			console.warn('Error parsing last seen version', error);
			return null;
		}
	},
	set lastSeenVersion(version: Date | null) {
		versionStore.value = version ? version.toISOString() : null;
	}
};
