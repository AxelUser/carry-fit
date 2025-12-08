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

	let isNonCompliantOpen = $state(false);
	let isCompliantOpen = $state(false);

	const hasCompliantAirlines = $derived(sortedCompliantAirlines.length > 0);
	const hasNonCompliantAirlines = $derived(sortedNonCompliantAirlines.length > 0);

	const onlyCompliantSection = $derived(hasCompliantAirlines && !hasNonCompliantAirlines);
	const onlyNonCompliantSection = $derived(!hasCompliantAirlines && hasNonCompliantAirlines);

	const complianceDetailsFoldable = $derived(
		variant === 'single-column' && hasCompliantAirlines && hasNonCompliantAirlines
	);

	const tableLayout = $derived(
		onlyCompliantSection || onlyNonCompliantSection ? 'single-column' : 'two-column'
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

	// Mutual exclusivity of compliance and non-compliance sections
	$effect(() => {
		// Always open compliance and non-compliance in two-column layout
		if (variant === 'two-column') {
			isNonCompliantOpen = true;
			isCompliantOpen = true;
			return;
		}

		// If only one section is available, open it
		if (onlyCompliantSection) {
			isNonCompliantOpen = false;
			isCompliantOpen = true;
			return;
		}

		if (onlyNonCompliantSection) {
			isNonCompliantOpen = true;
			isCompliantOpen = false;
			return;
		}

		// If both sections available and this is single-column layout, open non-compliant
		isNonCompliantOpen = true;
		isCompliantOpen = false;
	});

	let lastToggledSection = $state<'compliant' | 'non-compliant'>('non-compliant');

	function toggleSection(section: 'compliant' | 'non-compliant') {
		lastToggledSection = section;
		if (section === 'compliant') {
			if (isCompliantOpen) {
				isNonCompliantOpen = false;
				setTimeout(() => {
					document.getElementById('compliant-airlines')?.scrollIntoView({
						behavior: 'instant',
						block: 'start'
					});
				}, 0);
			}
		} else {
			if (isNonCompliantOpen) {
				isCompliantOpen = false;
				setTimeout(() => {
					document.getElementById('nonCompliant-airlines')?.scrollIntoView({
						behavior: 'instant',
						block: 'start'
					});
				}, 0);
			}
		}
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
		<SearchInput />

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
	{#if showComplianceResult}
		<div class="flex flex-col gap-6 xl:flex-row xl:items-start" data-testid="compliance-sections">
			{#if hasNonCompliantAirlines}
				<ComplianceCards
					variant="nonCompliant"
					airlines={sortedNonCompliantAirlines}
					{measurementSystem}
					bind:open={isNonCompliantOpen}
					layout={tableLayout}
					collapsible={complianceDetailsFoldable}
					bind:sortDirection
					{toggleFavorite}
					favoriteAirlines={favoriteAirlinesSet}
					onSectionToggle={toggleSection}
				/>
			{/if}

			{#if hasCompliantAirlines}
				<ComplianceCards
					variant="compliant"
					airlines={sortedCompliantAirlines}
					{measurementSystem}
					bind:open={isCompliantOpen}
					layout={tableLayout}
					collapsible={complianceDetailsFoldable}
					bind:sortDirection
					{toggleFavorite}
					favoriteAirlines={favoriteAirlinesSet}
					onSectionToggle={toggleSection}
				/>
			{/if}
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			<div class="flex justify-end">
				{@render sortButton()}
			</div>
			<div
				class="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3"
				style="contain: layout style;"
			>
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
	{/if}
{/snippet}
