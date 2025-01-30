<script lang="ts">
	import type { AirlineInfo } from '$lib/types';
	import { Check, X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '../ui/separator';
	import { Checkbox } from '../ui/checkbox';
	import { Label } from '../ui/label';
	import { badgeVariants } from '../ui/badge';
	import { cn } from '$lib/utils/styling';

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
							<button
								class={cn(
									badgeVariants({ variant: 'secondary' }),
									'focus:outline-none focus:ring-0 focus:ring-offset-0'
								)}
								onclick={selectAllRegions}
							>
								Select All
							</button>
							<button
								class={cn(
									badgeVariants({ variant: 'secondary' }),
									'focus:outline-none focus:ring-0 focus:ring-offset-0'
								)}
								onclick={clearAllRegions}
							>
								Clear All
							</button>
						</div>
					</div>

					<div class="mt-3 flex flex-wrap gap-2" data-testid="regions-filter-list">
						{#each allRegions as region}
							{@const isSelected = selectedRegions.has(region)}
							{@const isAvailable = isRegionAvailable(region)}

							<Button
								size="sm"
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

				<Separator />

				<div>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<h3 class="font-medium">Favorites</h3>
						</div>
						{#if favoriteAirlines.length > 0}
							<span data-testid="favorites-count" class="text-sm text-primary">
								{favoriteAirlines.length}
								{favoriteAirlines.length === 1 ? 'airline' : 'airlines'}
							</span>
						{/if}
					</div>
					<label class="mt-2 flex items-center gap-2">
						<Checkbox id="favorites-only-filter" bind:checked={showFavoritesOnly} />
						<Label for="favorites-only-filter">Favorites only</Label>
					</label>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>

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
