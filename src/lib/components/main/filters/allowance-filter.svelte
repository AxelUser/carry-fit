<script lang="ts">
	import type { AirlineInfo } from '$lib/types';
	import { X } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import FilterCombobox from './filter-combobox.svelte';
	import { cn } from '$lib/utils/ui';
	import { SvelteSet } from 'svelte/reactivity';

	const MAX_VISIBLE_FILTERS = 16;

	type FilterMode = 'regions' | 'airlines';

	interface Props {
		airlines: AirlineInfo[];
		filteredAirlines: AirlineInfo[];
		filterRegions: string[];
	}

	let { airlines, filteredAirlines = $bindable(), filterRegions = $bindable() }: Props = $props();

	let filterMode = $state<FilterMode>('regions');
	let selectedRegions = $state(new SvelteSet<string>());
	let selectedAirlines = $state(new SvelteSet<string>());
	let showAllDialogOpen = $state(false);
	let isInternalUpdate = $state(false);

	const allRegions = $derived([...new Set(airlines.map((airline) => airline.region))].sort());
	const allAirlineNames = $derived(airlines.map((airline) => airline.airline).sort());

	const isAllRegionsSelected = $derived(selectedRegions.size === 0);
	const isAllAirlinesSelected = $derived(selectedAirlines.size === 0);

	$effect(() => {
		if (filterMode === 'regions') {
			selectedAirlines.clear();
			if (isAllRegionsSelected) {
				filteredAirlines = airlines;
			} else {
				filteredAirlines = airlines.filter((airline) => selectedRegions.has(airline.region));
			}
			isInternalUpdate = true;
			filterRegions = Array.from(selectedRegions);
			isInternalUpdate = false;
		} else {
			selectedRegions.clear();
			if (isAllAirlinesSelected) {
				filteredAirlines = airlines;
			} else {
				filteredAirlines = airlines.filter((airline) => selectedAirlines.has(airline.airline));
			}
			isInternalUpdate = true;
			filterRegions = [];
			isInternalUpdate = false;
		}
	});

	$effect(() => {
		if (!isInternalUpdate && filterRegions.length > 0 && filterMode === 'regions') {
			const filterRegionsSet = new Set(filterRegions);

			if (
				selectedRegions.size !== filterRegionsSet.size ||
				!Array.from(selectedRegions).every((r) => filterRegionsSet.has(r))
			) {
				selectedRegions.clear();
				filterRegions.forEach((r) => selectedRegions.add(r));
			}
		}
	});

	const activeFilters = $derived.by(() => {
		if (filterMode === 'regions') {
			return isAllRegionsSelected ? [] : Array.from(selectedRegions);
		} else {
			return isAllAirlinesSelected ? [] : Array.from(selectedAirlines);
		}
	});

	const visibleFilters = $derived(activeFilters.slice(0, MAX_VISIBLE_FILTERS));

	const hiddenFiltersCount = $derived(Math.max(0, activeFilters.length - MAX_VISIBLE_FILTERS));

	function clearAllFilters() {
		if (filterMode === 'regions') {
			selectedRegions.clear();
		} else {
			selectedAirlines.clear();
		}
	}

	function removeFilter(filter: string) {
		if (filterMode === 'regions') {
			selectedRegions.delete(filter);
		} else {
			selectedAirlines.delete(filter);
		}
	}

	const regionSelectionCount = $derived(
		isAllRegionsSelected ? allRegions.length : selectedRegions.size
	);
	const airlineSelectionCount = $derived(
		isAllAirlinesSelected ? allAirlineNames.length : selectedAirlines.size
	);

	function getTriggerText(
		selectedCount: number,
		isAllSelected: boolean,
		placeholder: string,
		allSelectedText: string
	): string {
		if (isAllSelected) {
			return allSelectedText;
		}
		if (selectedCount === 1) {
			return `1 ${placeholder.slice(0, -1)} selected`;
		}
		return `${selectedCount} ${placeholder} selected`;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Filters</Card.Title>
		<Card.Description>
			Filter airlines to check cabin luggage compliance. Choose either whole regions or individual
			airlines.
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="space-y-6">
			<div class="grid gap-4 md:grid-cols-2">
				{#snippet filterCard(mode: FilterMode, title: string, count: number, total: number)}
					{@const isSelected = filterMode === mode}
					<button
						class={cn(
							'group rounded-lg border-2 p-4 text-left transition-colors',
							isSelected
								? 'border-primary bg-primary/5'
								: 'border-border bg-background hover:border-muted-foreground/50'
						)}
						onclick={() => (filterMode = mode)}
					>
						<div class="space-y-3">
							<h3
								class={cn('font-medium', isSelected ? 'text-foreground' : 'text-muted-foreground')}
							>
								{title}
							</h3>
							<div class="h-5">
								{#if isSelected}
									<p class="text-muted-foreground text-sm">
										{count} / {total} selected
									</p>
								{:else}
									<div class="h-5"></div>
								{/if}
							</div>
							{#if mode === 'regions'}
								<FilterCombobox
									items={allRegions}
									bind:selectedItems={selectedRegions}
									placeholder="region"
									searchPlaceholder="Search regions..."
									allSelectedText="All Regions"
									itemLabel={(item) => item}
									getTriggerText={(selectedCount, isAllSelected) =>
										getTriggerText(selectedCount, isAllSelected, 'regions', 'All Regions')}
									disabled={!isSelected}
								/>
							{:else}
								<FilterCombobox
									items={allAirlineNames}
									bind:selectedItems={selectedAirlines}
									placeholder="airline"
									searchPlaceholder="Search airlines..."
									allSelectedText="All Airlines"
									itemLabel={(item) => item}
									getTriggerText={(selectedCount, isAllSelected) =>
										getTriggerText(selectedCount, isAllSelected, 'airlines', 'All Airlines')}
									disabled={!isSelected}
								/>
							{/if}
						</div>
					</button>
				{/snippet}

				{@render filterCard('regions', 'By Regions', regionSelectionCount, allRegions.length)}
				{@render filterCard(
					'airlines',
					'By Airlines',
					airlineSelectionCount,
					allAirlineNames.length
				)}
			</div>

			{#if activeFilters.length > 0}
				<div class="border-primary bg-primary/5 rounded-lg border p-4">
					<div class="mb-3 flex items-center justify-between">
						<h4 class="font-medium">Current Filters</h4>
						<Button variant="ghost" size="sm" onclick={clearAllFilters}>Clear all</Button>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each visibleFilters as filter}
							<Badge class="gap-1 pr-1 text-sm">
								<span>{filter}</span>
								<button
									class="hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
									onclick={() => removeFilter(filter)}
									aria-label="Remove {filter}"
								>
									<X class="size-3" />
								</button>
							</Badge>
						{/each}
						{#if hiddenFiltersCount > 0}
							<Button
								variant="link"
								size="sm"
								class="h-6 text-xs"
								onclick={() => (showAllDialogOpen = true)}
							>
								{hiddenFiltersCount} more...
							</Button>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>

<Dialog.Root bind:open={showAllDialogOpen}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>
				All {filterMode === 'regions' ? 'Regions' : 'Airlines'} ({activeFilters.length})
			</Dialog.Title>
		</Dialog.Header>
		<ScrollArea class="max-h-[400px]">
			<div class="space-y-2 pr-4">
				{#each activeFilters as filter}
					<div class="flex items-center justify-between rounded-md border p-2">
						<span>{filter}</span>
						<Button
							variant="ghost"
							size="sm"
							class="h-8 w-8 p-0"
							onclick={() => removeFilter(filter)}
						>
							<X class="h-4 w-4" />
							<span class="sr-only">Remove {filter}</span>
						</Button>
					</div>
				{/each}
			</div>
		</ScrollArea>
		<Dialog.Footer>
			<Button variant="outline" onclick={clearAllFilters}>Clear all</Button>
			<Button onclick={() => (showAllDialogOpen = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
