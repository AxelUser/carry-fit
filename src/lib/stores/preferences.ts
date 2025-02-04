import { type MeasurementSystem, MeasurementSystems } from '$lib/types';
import { createLocalStore } from '$lib/storage/local-store.svelte';

let measurementSystemStore = createLocalStore<MeasurementSystem>(
	'carryfit_user_measurement_system',
	MeasurementSystems.Metric,
	(loaded, initial) => {
		if (loaded === MeasurementSystems.Metric || loaded === MeasurementSystems.Imperial) {
			return loaded;
		}
		return initial;
	}
);

let favoriteAirlinesStore = createLocalStore<string[]>(
	'carryfit_user_favorite_airlines',
	[],
	(loaded, initial) => {
		if (Array.isArray(loaded)) {
			return loaded;
		}
		return initial;
	}
);

export default {
	get measurementSystem() {
		return measurementSystemStore.value;
	},
	set measurementSystem(system: MeasurementSystem) {
		measurementSystemStore.value = system;
	},

	get favoriteAirlines() {
		return favoriteAirlinesStore.value;
	},
	set favoriteAirlines(airlines: string[]) {
		favoriteAirlinesStore.value = airlines;
	}
};
