import { computeMatchScore } from '$lib/utils/matching';
import type { AirlineInfo } from '$lib/types';

class SearchState {
	searchTerm = $state('');

	filterAirlines<T extends AirlineInfo>(airlines: T[]): T[] {
		if (!this.searchTerm) return airlines;

		return airlines
			.map((airline) => ({
				airline: airline,
				score: computeMatchScore(this.searchTerm, airline.airline)
			}))
			.sort((a, b) => b.score - a.score)
			.filter((airline) => airline.score > 0.15)
			.slice(0, 10)
			.map((airline) => airline.airline);
	}

	clearSearch() {
		this.searchTerm = '';
	}
}

export const searchState = new SearchState();
