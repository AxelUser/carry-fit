<script lang="ts">
	import type { AirlineInfo } from '$lib/types';
	import { Check, Pencil } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { Label } from '$lib/components/ui/label';
	import FavoriteAirlines from './favorite-airlines.svelte';

	interface Props {
		airlines: AirlineInfo[];
		favoriteAirlines: string[];
		filteredAirlines: AirlineInfo[];
		filterRegions: string[];
	}

	let {
		airlines,
		favoriteAirlines = $bindable(),
		filteredAirlines = $bindable(),
		filterRegions = $bindable()
	}: Props = $props();

	let showFavoritesOnly = $state(false);
	let showFavoriteAirlinesDialog = $state(false);

	const favoriteAirlinesSet = $derived(new Set(favoriteAirlines));

	const allRegions = [...new Set(airlines.map((airline) => airline.region))].sort();

	let selectedRegions = $state(new Set(filterRegions.length ? filterRegions : allRegions));

	const availableSelectedRegions = $derived(
		allRegions.filter((region) => selectedRegions.has(region) && isRegionAvailable(region))
	);

	$effect(() => {
		filteredAirlines = airlines
			.filter((airline) => selectedRegions.has(airline.region))
			.filter((airline) => !showFavoritesOnly || favoriteAirlinesSet.has(airline.airline));
		filterRegions = Array.from(selectedRegions);
	});

	function isRegionAvailable(region: string): boolean {
		return (
			!showFavoritesOnly ||
			airlines.some(
				(airline) => airline.region === region && favoriteAirlinesSet.has(airline.airline)
			)
		);
	}

	function selectAllRegions() {
		selectedRegions = new Set(allRegions);
	}

	function clearAllRegions() {
		selectedRegions = new Set();
	}

	function toggleRegion(region: string) {
		const newSet = new Set(selectedRegions);
		if (newSet.has(region)) {
			newSet.delete(region);
		} else {
			newSet.add(region);
		}
		selectedRegions = newSet;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Filters</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="space-y-6">
			<div class="space-y-6">
				<div>
					<div class="flex flex-col gap-3 sm:flex-row sm:justify-between">
						<div>
							<h3 class="font-medium">Regions</h3>
							<p class="text-xs text-muted-foreground sm:text-sm">
								{#if selectedRegions.size === 0}
									Choose regions to start comparing
								{:else}
									Showing {selectedRegions.size}
									{availableSelectedRegions.length === 1 ? 'region' : 'regions'}
								{/if}
							</p>
						</div>

						<div class="flex items-start gap-2">
							<Button variant="outline" size="sm" onclick={selectAllRegions}>Select All</Button>
							<Button variant="outline" size="sm" onclick={clearAllRegions}>Clear All</Button>
						</div>
					</div>

					<div
						class="mt-3 flex flex-wrap gap-2"
						data-tour-id="regions-filter-list"
						data-testid="regions-filter-list"
					>
						{#each allRegions as region}
							{@const isSelected = selectedRegions.has(region)}
							{@const isAvailable = isRegionAvailable(region)}

							<Button
								size="sm"
								variant={isSelected ? 'default' : 'outline'}
								disabled={!isAvailable}
								onclick={() => isAvailable && toggleRegion(region)}
								data-selected={isSelected}
								class="gap-2 text-sm"
							>
								<span>{region}</span>
								{#if isSelected && isAvailable}
									<div class="ml-2 animate-bounce">
										<Check class="h-4 w-4" />
									</div>
								{/if}
							</Button>
						{/each}
					</div>
				</div>

				<Separator />

				<div>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<h3 class="font-medium">Favorites</h3>
							<Button
								data-tour-id="favorite-airlines-manage-button"
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								onclick={() => (showFavoriteAirlinesDialog = true)}
							>
								<Pencil class="h-4 w-4" />
								<span class="sr-only">Manage favorite airlines</span>
							</Button>
						</div>
						{#if favoriteAirlines.length > 0}
							<span data-testid="favorites-count" class="text-sm text-primary">
								{favoriteAirlines.length}
								{favoriteAirlines.length === 1 ? 'airline' : 'airlines'}
							</span>
						{/if}
					</div>
					<label data-tour-id="favorites-only-filter" class="mt-2 flex items-center gap-2">
						<Checkbox id="favorites-only-filter" bind:checked={showFavoritesOnly} />
						<Label for="favorites-only-filter">Favorites only</Label>
					</label>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>

<FavoriteAirlines bind:open={showFavoriteAirlinesDialog} {airlines} bind:favoriteAirlines />

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
