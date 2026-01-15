import {
	SortDirections,
	type AirlineCompliance,
	type AirlineInfo,
	type SortDirection
} from '$lib/types';
import { searchAirlines, type SearchOptions } from '$lib/utils/matching';
import { watch } from 'runed';

type AirlinesToDisplay = AirlineInfo | AirlineCompliance;
type AirlinesListInput = {
	airlines: AirlineInfo[];
	complianceResults: AirlineCompliance[];
};

export class AirlinesList {
	public sortDirection: SortDirection = $state(SortDirections.Ascending);
	public searchTerm: string = $state('');

	public showCompliant: boolean = $state(true);
	public showNonCompliant: boolean = $state(true);

	private input: () => AirlinesListInput;

	private sortedAirlines: AirlineInfo[] = $derived.by(() => {
		return this.sortAirlines(this.sortDirection, this.input().airlines);
	});

	private sortedComplianceResults: AirlineCompliance[] = $derived.by(() => {
		return this.sortAirlines(this.sortDirection, this.input().complianceResults);
	});

	private complianceStats = $derived.by(() => {
		return this.sortedComplianceResults.reduce(
			(acc, airline) => {
				if (this.isCompliant(airline)) {
					acc.compliant++;
				} else {
					acc.nonCompliant++;
				}
				return acc;
			},
			{ compliant: 0, nonCompliant: 0 }
		);
	});

	private visibleAirlines: AirlinesToDisplay[] = $derived.by(() => {
		this.showCompliant;
		this.showNonCompliant;

		if (this.input().complianceResults.length === 0) {
			return this.sortedAirlines;
		}

		return this.sortedComplianceResults.filter((airline) => {
			if (this.isCompliant(airline)) {
				return this.showCompliant;
			}
			return this.showNonCompliant;
		});
	});

	private filteredVisibleAirlines: AirlinesToDisplay[] = $derived.by(() => {
		return this.filterByName(this.visibleAirlines, this.searchTerm);
	});

	private noSearchResults: boolean = $derived(
		this.searchTerm !== '' && this.filteredVisibleAirlines.length === 0
	);

	private mostSimilarAirline: AirlinesToDisplay | undefined = $derived.by(() => {
		const all = searchAirlines<AirlinesToDisplay>(this.searchTerm, this.visibleAirlines, {
			key: 'airline',
			threshold: 0.1
		} as SearchOptions<AirlinesToDisplay>);

		if (all.length === 0) {
			return undefined;
		}

		let best: { score: number; item: AirlinesToDisplay } | undefined = undefined;

		for (const result of all) {
			if (best === undefined) {
				best = result;
			} else if (result.score > best.score) {
				best = result;
			}
		}

		return best?.item;
	});

	constructor(inputGetter: () => AirlinesListInput) {
		this.input = () => inputGetter();

		watch(
			() => this.input(),
			() => {
				this.showCompliant = true;
				this.showNonCompliant = true;
			}
		);
	}

	private isCompliant(airline: AirlineCompliance) {
		return airline.complianceResults.every((result) => result.passed);
	}

	private sortAirlines<T extends AirlineInfo>(order: SortDirection, airlines: T[]) {
		const direction = order === SortDirections.Ascending ? 1 : -1;
		return airlines.toSorted((a, b) => a.airline.localeCompare(b.airline) * direction);
	}

	private filterByName<T extends AirlineInfo | AirlineCompliance>(
		airlines: T[],
		searchTerm: string
	): T[] {
		return searchAirlines<T>(searchTerm, airlines, {
			key: 'airline',
			shouldSort: false
		} as SearchOptions<T>).map((result) => result.item);
	}

	get current(): AirlinesToDisplay[] {
		return this.filteredVisibleAirlines;
	}

	get stats() {
		return this.complianceStats;
	}

	get emptySearch() {
		return this.noSearchResults;
	}

	get suggestion() {
		return this.mostSimilarAirline;
	}
}
