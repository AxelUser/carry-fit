import { fuzzySearch } from '$lib/utils/fuzzy-search';
import type { AirlineInfo } from '$lib/types';

class SearchState {
	searchTerm = $state('');

	filterAirlines<T extends AirlineInfo>(airlines: T[]): T[] {
		if (!this.searchTerm) return airlines;

		return airlines.filter((airline) => fuzzySearch(this.searchTerm, airline.airline));
	}

	clearSearch() {
		this.searchTerm = '';
	}
}

export const searchState = new SearchState();
