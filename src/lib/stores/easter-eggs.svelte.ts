import { createLocalStore } from '$lib/storage/local-store.svelte';

export interface EasterEggs {
	ultraWide: boolean;
}

const easterEggsStore = createLocalStore<EasterEggs>('easter-eggs', {
	ultraWide: true
});

export default {
	get ultraWide() {
		return easterEggsStore.isLoaded && easterEggsStore.value.ultraWide;
	},
	set ultraWide(value: boolean) {
		easterEggsStore.value = {
			...easterEggsStore.value,
			ultraWide: value
		};
	}
};
