<script lang="ts">
	import type { AirlineInfo } from '$lib/types';
	import { Check, X } from 'lucide-svelte';
	import { Delimiter } from '$lib/components/ui/delimiter';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		airlines: AirlineInfo[];
		favoriteAirlines: string[];
		filteredAirlines: AirlineInfo[];
	}

	let { airlines, favoriteAirlines, filteredAirlines = $bindable() }: Props = $props();

	let innerWidth = $state(0);
	const isMobile = $derived(innerWidth < 640);

	let showFavoritesOnly = $state(false);

	const favoriteAirlinesSet = $derived(new Set(favoriteAirlines));

	const allRegions = [...new Set(airlines.map((airline) => airline.region))].sort();

	let selectedRegions = $state(new Set(allRegions));

	const availableSelectedRegions = $derived(
		allRegions.filter((region) => selectedRegions.has(region) && isRegionAvailable(region))
	);

	$effect(() => {
		filteredAirlines = airlines
			.filter((airline) => selectedRegions.has(airline.region))
			.filter((airline) => !showFavoritesOnly || favoriteAirlinesSet.has(airline.airline));
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

<svelte:window bind:innerWidth />

<div class="mb-6">
	<h3 class="mb-4 text-base font-semibold text-sky-900 sm:text-lg">Filters</h3>

	<div class="space-y-6">
		<div>
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h4 class="font-medium text-sky-900">Regions</h4>
					<p class="text-xs text-sky-600 sm:text-sm">
						{#if selectedRegions.size === 0}
							Choose regions to start comparing
						{:else}
							Showing {selectedRegions.size}
							{availableSelectedRegions.length === 1 ? 'region' : 'regions'}
						{/if}
					</p>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<Button size={isMobile ? 'sm' : 'default'} variant="default" onclick={selectAllRegions}>
						<Check class="mr-1.5 h-4 w-4" />
						<span>Select All</span>
					</Button>
					<Button size={isMobile ? 'sm' : 'default'} variant="secondary" onclick={clearAllRegions}>
						<X class="mr-1.5 h-4 w-4" />
						<span>Clear All</span>
					</Button>
				</div>
			</div>

			<div class="mt-3 flex flex-wrap gap-2" data-testid="regions-filter-list">
				{#each allRegions as region}
					{@const isSelected = selectedRegions.has(region)}
					{@const isAvailable = isRegionAvailable(region)}

					<Button
						size={isMobile ? 'sm' : 'default'}
						variant={isSelected ? 'default' : 'outline'}
						disabled={!isAvailable}
						onclick={() => isAvailable && toggleRegion(region)}
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

		<Delimiter class="mb-4" />

		<div>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<h4 class="font-medium text-sky-900">Favorites</h4>
				</div>
				{#if favoriteAirlines.length > 0}
					<span data-testid="favorites-count" class="text-sm text-sky-600">
						{favoriteAirlines.length}
						{favoriteAirlines.length === 1 ? 'airline' : 'airlines'}
					</span>
				{/if}
			</div>
			<label class="mt-2 flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={showFavoritesOnly}
					class="form-checkbox rounded border-sky-300 text-sky-600 focus:ring-0 focus:ring-offset-0"
				/>
				<span class="text-sm text-sky-600">Favorites only</span>
			</label>
		</div>
	</div>
</div>

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
