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
	import ComplianceCards from './compliance-cards.svelte';
	import * as Card from '$lib/components/ui/card';
	import SearchInput from './search-input.svelte';
	import { searchState } from './search.svelte';
	import EmptyState from './empty-state.svelte';
	import { ArrowDownAZ, ArrowUpAZ } from 'lucide-svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	interface Props {
		measurementSystem: MeasurementSystem;
		favoriteAirlines: string[];
		airlines: AirlineInfo[];
		compliantAirlines: AirlineCompliance[];
		nonCompliantAirlines: AirlineCompliance[];
		variant: 'single-column' | 'two-column';
	}

	let {
		measurementSystem,
		favoriteAirlines = $bindable(),
		airlines,
		compliantAirlines,
		nonCompliantAirlines,
		variant
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

	const onlyCompliantSection = $derived(hasCompliantAirlines && !hasNonCompliantAirlines);
	const onlyNonCompliantSection = $derived(!hasCompliantAirlines && hasNonCompliantAirlines);

	const tableLayout = $derived(
		variant === 'two-column' && hasCompliantAirlines && hasNonCompliantAirlines
			? 'two-column'
			: onlyCompliantSection || onlyNonCompliantSection
				? 'single-column'
				: 'two-column'
	);

	const noSearchResults = $derived(
		searchState.searchTerm !== '' &&
			sortedAirlines.length === 0 &&
			sortedCompliantAirlines.length === 0 &&
			sortedNonCompliantAirlines.length === 0
	);

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

		{#if noSearchResults}
			<EmptyState
				title="No airlines found"
				description={`No airlines match your search "${searchState.searchTerm}"`}
			/>
		{:else if airlines.length === 0 && !showComplianceResult}
			<EmptyState
				title="Nothing to display"
				description="Try adjusting your filters to see available allowances"
			/>
		{:else if isLoading}
			<EmptyState
				variant="refreshing"
				title="Refreshing airlines"
				description="Please wait while we update the results"
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
	{@const complianceGridCols =
		hasCompliantAirlines && hasNonCompliantAirlines ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}

	{#if showComplianceResult}
		<div class={`grid gap-4 ${complianceGridCols}`} data-testid="compliance-sections">
			{#if hasNonCompliantAirlines}
				<ComplianceCards
					variant="nonCompliant"
					airlines={sortedNonCompliantAirlines}
					{measurementSystem}
					layout={tableLayout}
					{toggleFavorite}
					favoriteAirlines={favoriteAirlinesSet}
					scrollable
				/>
			{/if}

			{#if hasCompliantAirlines}
				<ComplianceCards
					variant="compliant"
					airlines={sortedCompliantAirlines}
					{measurementSystem}
					layout={tableLayout}
					{toggleFavorite}
					favoriteAirlines={favoriteAirlinesSet}
					scrollable
				/>
			{/if}
		</div>
	{:else}
		<ScrollArea class="h-[640px] pr-2">
			<div class="pb-2">
				<div class="grid auto-rows-fr gap-4 sm:grid-cols-2" style="contain: layout style;">
					{#each sortedAirlines as airline, i (airline.airline + i)}
						<AirlineCard
							{airline}
							{measurementSystem}
							isFavorite={favoriteAirlinesSet.has(airline.airline)}
							{toggleFavorite}
						/>
					{/each}
				</div>
			</div>
		</ScrollArea>
	{/if}
{/snippet}
