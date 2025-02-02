import type { TourNames } from '$lib/tours/types';
import { createLocalStore } from '$lib/storage/local-store.svelte';

interface TourStates {
	completedTours: TourNames[];
}

const STORAGE_KEY = 'carryfit_tours';

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

	markTourCompleted(tour: TourNames) {
		if (!this.completedTours.includes(tour)) {
			tourStore.value = {
				...tourStore.value,
				completedTours: [...tourStore.value.completedTours, tour]
			};
		}
	},

	isTourCompleted(tour: TourNames): boolean {
		return this.completedTours.includes(tour);
	},

	resetTours() {
		tourStore.value = defaultStates;
	}
};
