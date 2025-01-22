<script lang="ts">
	import type { AirlineInfo } from '$lib/types';
	import { Check, X } from 'lucide-svelte';

	interface Props {
		allowances: AirlineInfo[];
		favoriteAirlines: string[];
		filteredAirlines: AirlineInfo[];
	}

	let { allowances, favoriteAirlines, filteredAirlines = $bindable() }: Props = $props();

	let showFavoritesOnly = $state(false);

	const favoriteAirlinesSet = $derived(new Set(favoriteAirlines));

	const allRegions = [...new Set(allowances.map((airline) => airline.region))].sort();

	let selectedRegions = $state(new Set(allRegions));

	const availableSelectedRegions = $derived(
		allRegions.filter((region) => selectedRegions.has(region) && isRegionAvailable(region))
	);

	$effect(() => {
		filteredAirlines = allowances
			.filter((airline) => selectedRegions.has(airline.region))
			.filter((airline) => !showFavoritesOnly || favoriteAirlinesSet.has(airline.airline));
	});

	function isRegionAvailable(region: string): boolean {
		return (
			!showFavoritesOnly ||
			allowances.some(
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
					<button
						class="flex items-center justify-center gap-1.5 rounded-lg bg-sky-100 px-2 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-200 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
						onclick={selectAllRegions}
					>
						<Check class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						<span>Select All</span>
					</button>
					<button
						class="flex items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
						onclick={clearAllRegions}
					>
						<X class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						<span>Clear All</span>
					</button>
				</div>
			</div>

			<div class="mt-3 flex flex-wrap gap-2" data-testid="regions-filter-list">
				{#each allRegions as region}
					{@const isSelected = selectedRegions.has(region)}
					{@const isAvailable = isRegionAvailable(region)}
					<button
						class="flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm
                            {isAvailable
							? isSelected
								? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md hover:from-sky-700 hover:to-blue-800'
								: 'bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50'
							: 'cursor-not-allowed bg-gray-100 text-gray-400 ring-1 ring-gray-200'}"
						onclick={() => isAvailable && toggleRegion(region)}
						disabled={!isAvailable}
					>
						<span>{region}</span>
						{#if isSelected && isAvailable}
							<div class="ml-2 animate-bounce">
								<Check class="h-3 w-3 sm:h-4 sm:w-4" />
							</div>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<div class="border-t border-sky-100 pt-4">
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
