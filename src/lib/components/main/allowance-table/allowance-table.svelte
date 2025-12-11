<script lang="ts">
	import {
		SortDirections,
		type AirlineCompliance,
		type AirlineInfo,
		type MeasurementSystem,
		type SortDirection
	} from '$lib/types';
	import { metrics } from '$lib/analytics';
	import { debounce } from '$lib/utils/actions';
	import AirlineCard from './airline-card.svelte';
	import * as Card from '$lib/components/ui/card';
	import SearchInput from './search-input.svelte';
	import { searchState } from './search.svelte';
	import EmptyState from './empty-state.svelte';
	import { ArrowDownAZ, ArrowUpAZ } from 'lucide-svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	type ComplianceCategory = 'compliant' | 'non-compliant';

	interface Props {
		measurementSystem: MeasurementSystem;
		favoriteAirlines: string[];
		airlines: AirlineInfo[];
		compliantAirlines: AirlineCompliance[];
		nonCompliantAirlines: AirlineCompliance[];
	}

	let {
		measurementSystem,
		favoriteAirlines = $bindable(),
		airlines,
		compliantAirlines,
		nonCompliantAirlines
	}: Props = $props();

	const favoriteAirlinesSet = $derived(new Set(favoriteAirlines));

	const showComplianceResult = $derived(
		compliantAirlines.length > 0 || nonCompliantAirlines.length > 0
	);

	let sortDirection = $state<SortDirection>(SortDirections.Ascending);

	const sortedAirlines = $derived(sortAirlines(searchState.filterAirlines(airlines)));
	const sortedCompliantAirlines = $derived(
		sortAirlines(searchState.filterAirlines(compliantAirlines))
	);
	const sortedNonCompliantAirlines = $derived(
		sortAirlines(searchState.filterAirlines(nonCompliantAirlines))
	);

	const hasCompliantAirlines = $derived(sortedCompliantAirlines.length > 0);
	const hasNonCompliantAirlines = $derived(sortedNonCompliantAirlines.length > 0);

	const gridColumns = 'sm:grid-cols-2';

	const availableComplianceCategories = $derived<ComplianceCategory[]>(
		(() => {
			const categories: ComplianceCategory[] = [];
			if (hasCompliantAirlines) {
				categories.push('compliant');
			}
			if (hasNonCompliantAirlines) {
				categories.push('non-compliant');
			}
			return categories;
		})()
	);

	let visibleComplianceCategories = $state<ComplianceCategory[]>([]);
	let hasInitializedSelection = $state(false);

	$effect(() => {
		if (!showComplianceResult) {
			visibleComplianceCategories = [];
			hasInitializedSelection = false;
			return;
		}

		const defaultCategories =
			availableComplianceCategories.length === 2
				? (['compliant', 'non-compliant'] satisfies ComplianceCategory[])
				: availableComplianceCategories;

		if (!hasInitializedSelection && visibleComplianceCategories.length === 0) {
			visibleComplianceCategories = defaultCategories;
			hasInitializedSelection = true;
			return;
		}

		const filteredSelection = visibleComplianceCategories.filter((category) =>
			availableComplianceCategories.includes(category)
		);

		if (filteredSelection.length !== visibleComplianceCategories.length) {
			visibleComplianceCategories = filteredSelection;
		}
	});

	const complianceAirlines = $derived<AirlineCompliance[]>(
		(() => {
			if (!showComplianceResult) {
				return [];
			}

			const airlinesToShow: AirlineCompliance[] = [];

			if (visibleComplianceCategories.includes('compliant')) {
				airlinesToShow.push(...sortedCompliantAirlines);
			}

			if (visibleComplianceCategories.includes('non-compliant')) {
				airlinesToShow.push(...sortedNonCompliantAirlines);
			}

			return sortAirlines(airlinesToShow);
		})()
	);

	const visibleAirlines = $derived<AirlineInfo[]>(
		showComplianceResult ? complianceAirlines : sortedAirlines
	);
	const hasVisibleAirlines = $derived(visibleAirlines.length > 0);
	const showComplianceToggle = $derived(availableComplianceCategories.length === 2);

	const noSearchResults = $derived(searchState.searchTerm !== '' && visibleAirlines.length === 0);

	function sortAirlines<T extends AirlineInfo>(airlines: T[]) {
		return airlines.toSorted((a, b) => {
			const direction = sortDirection === SortDirections.Ascending ? 1 : -1;
			return a.airline.localeCompare(b.airline) * direction;
		});
	}

	function toggleSortDirection() {
		sortDirection =
			sortDirection === SortDirections.Ascending
				? SortDirections.Descending
				: SortDirections.Ascending;
	}

	function toggleFavorite(airlineName: string) {
		const isFavorite = favoriteAirlinesSet.has(airlineName);
		favoriteAirlines = isFavorite
			? favoriteAirlines.filter((name) => name !== airlineName)
			: [...favoriteAirlines, airlineName];

		metrics.favoriteAirlineToggled();
	}

	// This is a workaround to prevent the sluggishness of the table when the airlines data is updated
	let isLoading = $state(false);
	const debouncedUpdate = debounce(() => {
		isLoading = false;
	}, 1000);

	$effect(() => {
		if (compliantAirlines || nonCompliantAirlines || airlines) {
			isLoading = true;
			debouncedUpdate();
		}
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Airlines</Card.Title>
	</Card.Header>
	<Card.Content class="flex min-h-[300px] flex-col gap-4 overflow-x-auto">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<SearchInput />
			<div class="flex justify-end">{@render sortButton()}</div>
		</div>

		{#if showComplianceResult && showComplianceToggle}
			<ToggleGroup.Root
				variant="outline"
				type="multiple"
				class="flex flex-wrap justify-end gap-2"
				bind:value={visibleComplianceCategories}
				aria-label="Filter airlines by compliance"
			>
				<ToggleGroup.Item value="compliant" aria-label="Show compliant airlines">
					Compliant ({sortedCompliantAirlines.length})
				</ToggleGroup.Item>
				<ToggleGroup.Item value="non-compliant" aria-label="Show non-compliant airlines">
					Non-compliant ({sortedNonCompliantAirlines.length})
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		{/if}

		{#if noSearchResults}
			<EmptyState
				title="No airlines found"
				description={`No airlines match your search "${searchState.searchTerm}"`}
			/>
		{:else if isLoading}
			<EmptyState
				variant="refreshing"
				title="Refreshing airlines"
				description="Please wait while we update the results"
			/>
		{:else if !hasVisibleAirlines}
			<EmptyState
				title="Nothing to display"
				description={showComplianceResult
					? 'Adjust the compliance filters or search to see airlines'
					: 'Try adjusting your filters to see available allowances'}
			/>
		{:else}
			{@render airlinesGrid()}
		{/if}
	</Card.Content>
</Card.Root>

{#snippet sortButton()}
	<button
		class="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-muted"
		onclick={toggleSortDirection}
		aria-label="Sort airlines"
	>
		Sort
		{#if sortDirection === SortDirections.Ascending}
			<ArrowDownAZ class="size-4" />
		{:else}
			<ArrowUpAZ class="size-4" />
		{/if}
	</button>
{/snippet}

{#snippet airlinesGrid()}
	<ScrollArea class="h-[640px] pr-2">
		<div class="pb-2">
			<div
				class={`grid auto-rows-fr gap-4 ${gridColumns}`}
				style="contain: layout style;"
				data-testid="airline-cards"
			>
				{#each visibleAirlines as airline, i (airline.airline + i)}
					<AirlineCard
						{airline}
						{measurementSystem}
						complianceResults={(airline as AirlineCompliance).complianceResults}
						personalItemComplianceResults={(airline as AirlineCompliance)
							.personalItemComplianceResults}
						isFavorite={favoriteAirlinesSet.has(airline.airline)}
						{toggleFavorite}
					/>
				{/each}
			</div>
		</div>
	</ScrollArea>
{/snippet}
