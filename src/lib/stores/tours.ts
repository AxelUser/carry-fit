import type { TourName } from '$lib/tours/types';
import { createLocalStore } from '$lib/storage/local-store.svelte';

interface TourState {
	name: TourName;
	dateShown: string;
}

interface TourStates {
	completedTours: TourState[];
}

const STORAGE_KEY = 'tour_states';

const defaultStates: TourStates = {
	completedTours: []
};

const tourStore = createLocalStore<TourStates>(STORAGE_KEY, defaultStates, (loaded, initial) => ({
	...initial,
	...loaded
}));

export default {
	get completedTours() {
		return tourStore.value.completedTours;
	},

	markTourCompleted(tour: TourName) {
		tourStore.value = {
			...tourStore.value,
			completedTours: [
				...tourStore.value.completedTours.filter((t) => t.name !== tour),
				{ name: tour, dateShown: new Date().toISOString() }
			]
		};
	},

	isTourCompleted(tour: TourName, tourUpdateDate: Date): boolean {
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
