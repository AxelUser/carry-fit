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
	import EmptyState from './empty-state.svelte';
	import { ArrowDownAZ, ArrowUpAZ } from '@lucide/svelte';
	import { Button } from '$ui/button';
	import { VirtualList } from 'svelte-virtuallists';
	import { MediaQuery } from 'svelte/reactivity';
	import Toggle from '../ui/toggle/toggle.svelte';
	import { watch } from 'runed';
	import { searchAirlines, type SearchOptions } from '$lib/utils/matching';

	interface Props {
		measurementSystem: MeasurementSystem;
		airlines: AirlineInfo[];
		complianceResults: AirlineCompliance[];
	}

	let { measurementSystem, airlines, complianceResults }: Props = $props();
	const isCompliant = (airline: AirlineCompliance) =>
		airline.complianceResults.every((result) => result.passed);

	// Sort by airline name
	let sortDirection = $state<SortDirection>(SortDirections.Ascending);
	function toggleSortDirection() {
		sortDirection =
			sortDirection === SortDirections.Ascending
				? SortDirections.Descending
				: SortDirections.Ascending;
	}

	function sortAirlines<T extends AirlineInfo>(order: SortDirection, airlines: T[]) {
		const direction = order === SortDirections.Ascending ? 1 : -1;
		return airlines.toSorted((a, b) => a.airline.localeCompare(b.airline) * direction);
	}

	const sortedAirlines = $derived(sortAirlines(sortDirection, airlines));
	const sortedComplianceResults = $derived(sortAirlines(sortDirection, complianceResults));

	const complianceStats = $derived.by(() => {
		return sortedComplianceResults.reduce(
			(acc, airline) => {
				if (isCompliant(airline)) {
					acc.compliant++;
				} else {
					acc.nonCompliant++;
				}
				return acc;
			},
			{ compliant: 0, nonCompliant: 0 }
		);
	});

	// Toggling compliance result groups
	let showCompliant = $state(true);
	let showNonCompliant = $state(true);
	watch(
		() => complianceResults,
		() => {
			showCompliant = true;
			showNonCompliant = true;
		}
	);

	const visibleAirlines = $derived.by<AirlineCompliance[] | AirlineInfo[]>(() => {
		showCompliant;
		showNonCompliant;

		if (complianceResults.length === 0) {
			return sortedAirlines;
		}

		return sortedComplianceResults.filter((airline) => {
			if (isCompliant(airline)) {
				return showCompliant;
			}
			return showNonCompliant;
		});
	});

	// Search by airline name
	let searchTerm = $state('');
	const filterByName = <T extends AirlineInfo | AirlineCompliance>(
		airlines: T[],
		searchTerm: string
	): T[] => {
		return searchAirlines<T>(searchTerm, airlines, {
			key: 'airline',
			shouldSort: false
		} as SearchOptions<T>).map((result) => result.item);
	};

	const filteredVisibleAirlines = $derived.by(() => {
		return filterByName(visibleAirlines, searchTerm);
	});

	const noSearchResults = $derived(searchTerm !== '' && filteredVisibleAirlines.length === 0);
	// TODO: unoptimal as hell, need to improve api for this
	const mostSimilarAirline = $derived.by(() => {
		const all = searchAirlines<AirlineInfo | AirlineCompliance>(searchTerm, visibleAirlines, {
			key: 'airline',
			threshold: 0
		} as SearchOptions<AirlineInfo | AirlineCompliance>);

		if (all.length === 0) {
			return undefined;
		}

		let best: { score: number; item: AirlineInfo | AirlineCompliance } | undefined = undefined;

		for (const result of all) {
			if (best === undefined) {
				best = result;
			} else if (result.score > best.score) {
				best = result;
			}
		}

		return best?.item;
	});

	// Grid layout
	const isDesktop = new MediaQuery('(min-width: 768px)', true);
	const columnCount = $derived(isDesktop.current ? 2 : 1);
	const airlineRows = $derived.by(() => {
		const rows: AirlineInfo[][] = [];
		for (let i = 0; i < filteredVisibleAirlines.length; i += columnCount) {
			rows.push(filteredVisibleAirlines.slice(i, i + columnCount));
		}
		return rows;
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Airlines</Card.Title>
	</Card.Header>
	<Card.Content
		class="flex min-h-[300px] flex-col gap-4 overflow-x-auto"
		data-testid="allowances-grid"
	>
		<div class="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
			<SearchInput bind:searchTerm />
			<div class="flex justify-end">{@render sortButton()}</div>
		</div>

		{#if complianceStats.compliant > 0 && complianceStats.nonCompliant > 0}
			<div class="flex flex-wrap justify-end gap-2" aria-label="Filter airlines by compliance">
				<Toggle
					size="sm"
					variant="outline"
					bind:pressed={showCompliant}
					class="h-8 gap-2 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
				>
					{showCompliant ? 'Hide' : 'Show'} Compliant ({complianceStats.compliant})
				</Toggle>
				<Toggle
					size="sm"
					variant="outline"
					bind:pressed={showNonCompliant}
					class="h-8 gap-2 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
				>
					{showNonCompliant ? 'Hide' : 'Show'} Non-compliant ({complianceStats.nonCompliant})
				</Toggle>
			</div>
		{/if}

		{#if noSearchResults}
			<EmptyState
				title="No airlines found"
				description={`No airlines match your search "${searchTerm}".${mostSimilarAirline ? ` Did you mean "${mostSimilarAirline.airline}"?` : ''}`}
			/>
		{:else if filteredVisibleAirlines.length === 0}
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
