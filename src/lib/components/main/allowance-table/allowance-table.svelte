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
	import { ArrowDownAZ, ArrowUpAZ, Check } from 'lucide-svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Button } from '$lib/components/ui/button';

	type ComplianceCategory = 'compliant' | 'non-compliant';

	interface Props {
		measurementSystem: MeasurementSystem;
		favoriteAirlines: string[];
		airlines: AirlineInfo[];
		complianceAirlines: AirlineCompliance[];
	}

	let {
		measurementSystem,
		favoriteAirlines = $bindable(),
		airlines,
		complianceAirlines
	}: Props = $props();

	const favoriteAirlinesSet = $derived(new Set(favoriteAirlines));
	const isCompliant = (airline: AirlineCompliance) =>
		airline.complianceResults.every((result) => result.passed);

	const showComplianceResult = $derived(complianceAirlines.length > 0);

	let sortDirection = $state<SortDirection>(SortDirections.Ascending);

	const sortedAirlines = $derived(
		sortAirlines(sortDirection, searchState.filterAirlines(airlines))
	);
	const sortedComplianceAirlines = $derived(
		sortAirlines(sortDirection, searchState.filterAirlines(complianceAirlines))
	);
	const compliantAirlines = $derived(sortedComplianceAirlines.filter(isCompliant));
	const nonCompliantAirlines = $derived(
		sortedComplianceAirlines.filter((airline) => !isCompliant(airline))
	);

	const hasCompliantAirlines = $derived(compliantAirlines.length > 0);
	const hasNonCompliantAirlines = $derived(nonCompliantAirlines.length > 0);

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

	function toggleComplianceCategory(category: ComplianceCategory) {
		if (visibleComplianceCategories.includes(category)) {
			visibleComplianceCategories = visibleComplianceCategories.filter(
				(selected) => selected !== category
			);
			return;
		}

		visibleComplianceCategories = [...visibleComplianceCategories, category];
	}

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

	const complianceAirlinesToShow = $derived.by<AirlineCompliance[]>(() => {
		if (!showComplianceResult) {
			return [];
		}

		return sortedComplianceAirlines.filter((airline) => {
			if (isCompliant(airline)) {
				return visibleComplianceCategories.includes('compliant');
			}
			return visibleComplianceCategories.includes('non-compliant');
		});
	});

	const visibleAirlines = $derived<AirlineInfo[]>(
		showComplianceResult ? complianceAirlinesToShow : sortedAirlines
	);
	const hasVisibleAirlines = $derived(visibleAirlines.length > 0);
	const showComplianceToggle = $derived(availableComplianceCategories.length === 2);

	const noSearchResults = $derived(searchState.searchTerm !== '' && visibleAirlines.length === 0);

	function sortAirlines<T extends AirlineInfo>(order: SortDirection, airlines: T[]) {
		const direction = order === SortDirections.Ascending ? 1 : -1;
		return airlines.toSorted((a, b) => a.airline.localeCompare(b.airline) * direction);
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

	// FIXME: This is a workaround to prevent the sluggishness of the table when the airlines data is updated. Need proper grid virtualization.
	let isLoading = $state(false);
	const debouncedUpdate = debounce(() => {
		isLoading = false;
	}, 1000);

	$effect(() => {
		if (complianceAirlines || airlines) {
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
			<div class="flex flex-wrap justify-end gap-2" aria-label="Filter airlines by compliance">
				<Button
					size="sm"
					variant={visibleComplianceCategories.includes('compliant') ? 'default' : 'outline'}
					onclick={() => toggleComplianceCategory('compliant')}
					class="h-8 gap-2 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
				>
					Compliant ({compliantAirlines.length})
					{#if visibleComplianceCategories.includes('compliant')}
						<div class="ml-1 animate-bounce">
							<Check class="h-4 w-4" />
						</div>
					{/if}
				</Button>
				<Button
					size="sm"
					variant={visibleComplianceCategories.includes('non-compliant') ? 'default' : 'outline'}
					onclick={() => toggleComplianceCategory('non-compliant')}
					class="h-8 gap-2 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
				>
					Non-compliant ({nonCompliantAirlines.length})
					{#if visibleComplianceCategories.includes('non-compliant')}
						<div class="ml-1 animate-bounce">
							<Check class="h-4 w-4" />
						</div>
					{/if}
				</Button>
			</div>
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
				class="grid auto-rows-fr gap-4 sm:grid-cols-2"
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

<style>
	@keyframes bounce {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.2);
			opacity: 1;
		}
		75% {
			transform: scale(0.8);
		}
		100% {
			transform: scale(1);
		}
	}

	.animate-bounce {
		animation: bounce 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
	}
</style>
