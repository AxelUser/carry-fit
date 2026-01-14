<script lang="ts">
	import {
		SortDirections,
		type AirlineCompliance,
		type AirlineInfo,
		type MeasurementSystem
	} from '$lib/types';
	import AirlineCard from './airline-card.svelte';
	import * as Card from '$ui/card';
	import SearchInput from './search-input.svelte';
	import EmptyState from './empty-state.svelte';
	import { ArrowDownAZ, ArrowUpAZ } from '@lucide/svelte';
	import { Button } from '$ui/button';
	import { VirtualList } from 'svelte-virtuallists';
	import { MediaQuery } from 'svelte/reactivity';
	import { Toggle } from '$ui/toggle';
	import { AirlinesList } from './airlines-list.svelte';

	interface Props {
		measurementSystem: MeasurementSystem;
		airlines: AirlineInfo[];
		complianceResults: AirlineCompliance[];
	}

	type AirlinesToDisplay = AirlineInfo | AirlineCompliance;

	let { measurementSystem, airlines, complianceResults }: Props = $props();

	// Sort by airline name
	const airlinesList = new AirlinesList(() => ({
		airlines,
		complianceResults
	}));

	function toggleSortDirection() {
		airlinesList.sortDirection =
			airlinesList.sortDirection === SortDirections.Ascending
				? SortDirections.Descending
				: SortDirections.Ascending;
	}

	// Grid layout
	const isDesktop = new MediaQuery('(min-width: 768px)', true);
	const columnCount = $derived(isDesktop.current ? 2 : 1);
	const airlineRows = $derived.by(() => {
		const rows: AirlinesToDisplay[][] = [];
		for (let i = 0; i < airlinesList.current.length; i += columnCount) {
			rows.push(airlinesList.current.slice(i, i + columnCount));
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
			<SearchInput bind:searchTerm={airlinesList.searchTerm} />
			<div class="flex justify-end">{@render sortButton()}</div>
		</div>

		{#if airlinesList.stats.compliant > 0 && airlinesList.stats.nonCompliant > 0}
			<div class="flex flex-wrap justify-end gap-2" aria-label="Filter airlines by compliance">
				<Toggle
					size="sm"
					variant="outline"
					bind:pressed={airlinesList.showCompliant}
					class="h-8 gap-2 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
				>
					{airlinesList.showCompliant ? 'Hide' : 'Show'} Compliant ({airlinesList.stats.compliant})
				</Toggle>
				<Toggle
					size="sm"
					variant="outline"
					bind:pressed={airlinesList.showNonCompliant}
					class="h-8 gap-2 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
				>
					{airlinesList.showNonCompliant ? 'Hide' : 'Show'} Non-compliant ({airlinesList.stats
						.nonCompliant})
				</Toggle>
			</div>
		{/if}

		{#if airlinesList.emptySearch}
			<EmptyState
				title="No airlines found"
				description={`No airlines match your search "${airlinesList.searchTerm}".${airlinesList.suggestion ? ` Did you mean "${airlinesList.suggestion.airline}"?` : ''}`}
			/>
		{:else if airlinesList.current.length === 0}
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
		{#if airlinesList.sortDirection === SortDirections.Ascending}
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
