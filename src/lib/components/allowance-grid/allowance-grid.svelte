<script lang="ts">
	import {
		SortDirections,
		type AirlineCompliance,
		type AirlineInfo,
		type MeasurementSystem,
		type SortDirection
	} from '$lib/types';
	import AirlineCard from './airline-card.svelte';
	import * as Card from '$ui/card';
	import SearchInput from './search-input.svelte';
	import { searchState } from './search.svelte';
	import EmptyState from './empty-state.svelte';
	import { ArrowDownAZ, ArrowUpAZ, Check } from '@lucide/svelte';
	import { Button } from '$ui/button';
	import { untrack } from 'svelte';
	import { VirtualList } from 'svelte-virtuallists';

	type ComplianceCategory = 'compliant' | 'non-compliant';

	interface Props {
		measurementSystem: MeasurementSystem;
		airlines: AirlineInfo[];
		complianceAirlines: AirlineCompliance[];
	}

	let { measurementSystem, airlines, complianceAirlines }: Props = $props();
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
	let previousAvailableCategories = $state<ComplianceCategory[]>([]);

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
			previousAvailableCategories = [];
			return;
		}

		const defaultCategories =
			availableComplianceCategories.length === 2
				? (['compliant', 'non-compliant'] satisfies ComplianceCategory[])
				: availableComplianceCategories;

		// Reset selection to all available categories when compliance results change
		const categoriesChanged =
			untrack(() => previousAvailableCategories.length) !== availableComplianceCategories.length ||
			!untrack(() =>
				previousAvailableCategories.every((cat) => availableComplianceCategories.includes(cat))
			);

		if (categoriesChanged) {
			visibleComplianceCategories = defaultCategories;
			previousAvailableCategories = [...availableComplianceCategories];
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

	let windowWidth = $state(0);
	const columnCount = $derived(windowWidth > 800 ? 2 : 1);

	const airlineRows = $derived.by(() => {
		const rows: AirlineInfo[][] = [];
		for (let i = 0; i < visibleAirlines.length; i += columnCount) {
			rows.push(visibleAirlines.slice(i, i + columnCount));
		}
		return rows;
	});
</script>

<svelte:window bind:innerWidth={windowWidth} />
<Card.Root>
	<Card.Header>
		<Card.Title>Airlines</Card.Title>
	</Card.Header>
	<Card.Content
		class="flex min-h-[300px] flex-col gap-4 overflow-x-auto"
		data-testid="allowances-grid"
	>
		<div class="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
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
		{:else if !hasVisibleAirlines}
			<EmptyState
				title="Nothing to display"
				description="Try adjusting your filters to see available allowances"
			/>
		{:else}
			{@render airlinesGrid()}
		{/if}
	</Card.Content>
</Card.Root>

{#snippet sortButton()}
	<Button size="sm" variant="outline" onclick={toggleSortDirection} aria-label="Sort airlines">
		Sort
		{#if sortDirection === SortDirections.Ascending}
			<ArrowDownAZ class="size-4" />
		{:else}
			<ArrowUpAZ class="size-4" />
		{/if}
	</Button>
{/snippet}

{#snippet airlinesGrid()}
	<VirtualList items={airlineRows} style="height: 640px;">
		{#snippet vl_slot({ index, item: row })}
			<!-- This hardcoded min height is to stabilize the virtual item height, else it will be crazy jumping up and down when size is recalculated -->
			<div class="mb-4 flex min-h-[304px] gap-4 px-2">
				{#each row as airline}
					<div class="min-w-0 flex-1">
						<AirlineCard
							{airline}
							{measurementSystem}
							complianceResults={(airline as AirlineCompliance).complianceResults}
							personalItemComplianceResults={(airline as AirlineCompliance)
								.personalItemComplianceResults}
						/>
					</div>
				{/each}
				{#if row.length < columnCount}
					{#each Array(columnCount - row.length) as _}
						<div class="min-w-0 flex-1"></div>
					{/each}
				{/if}
			</div>
		{/snippet}
	</VirtualList>
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
