import { createLocalStore } from '$lib/storage/local-store.svelte';

interface TourState {
	name: string;
	dateShown: string;
}

interface TourStates {
	completedTours: TourState[];
	disabled?: boolean;
}

const STORAGE_KEY = 'tours';

const defaultStates: TourStates = {
	completedTours: []
};

const tourStore = createLocalStore<TourStates>(STORAGE_KEY, defaultStates, (loaded, initial) => ({
	...initial,
	...loaded
}));

export default {
	get disabled() {
		return tourStore.value.disabled ?? false;
	},

	get completedTours() {
		return tourStore.value.completedTours;
	},

	markTourCompleted(tour: string) {
		tourStore.value = {
			...tourStore.value,
			completedTours: [
				...tourStore.value.completedTours.filter((t) => t.name !== tour),
				{ name: tour, dateShown: new Date().toISOString() }
			]
		};
	},

	isTourCompleted(tour: string, tourUpdateDate: Date): boolean {
		return (
			this.completedTours.find(
				(t) =>
					t.name === tour && t.dateShown !== undefined && new Date(t.dateShown) >= tourUpdateDate
			) !== undefined
		);
	},

	resetTours() {
		tourStore.value = defaultStates;
	}
};
