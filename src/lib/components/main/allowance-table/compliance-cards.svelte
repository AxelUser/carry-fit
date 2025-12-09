<script lang="ts">
	import {
		SortDirections,
		type AirlineCompliance,
		type MeasurementSystem,
		type SortDirection
	} from '$lib/types';
	import { ChevronsDownUp, ChevronsUpDown, ArrowDownAZ, ArrowUpAZ } from 'lucide-svelte';
	import AirlineCard from './airline-card.svelte';
	import { CarryOnBagCheckedIcon, CarryOnBagInactiveIcon } from '$lib/components/icons';
	import { tv } from 'tailwind-variants';
	import { cn } from '$lib/utils/styling';

	interface Props {
		airlines: AirlineCompliance[];
		measurementSystem: MeasurementSystem;
		open: boolean;
		layout: 'single-column' | 'two-column';
		variant: 'nonCompliant' | 'compliant';
		collapsible: boolean;
		sortDirection: SortDirection;
		toggleFavorite: (airline: string) => void;
		onSectionToggle: (section: 'compliant' | 'non-compliant') => void;
		favoriteAirlines: Set<string>;
	}

	const container = tv({
		base: 'flex-1',
		variants: {
			layout: {
				'single-column': '',
				'two-column': 'xl:max-w-[50%]'
			}
		}
	});

	let {
		airlines,
		measurementSystem,
		open = $bindable(),
		layout,
		variant,
		collapsible,
		sortDirection = $bindable(),
		toggleFavorite,
		onSectionToggle,
		favoriteAirlines
	}: Props = $props();

	const buttonStyles = {
		compliant: 'text-emerald-700',
		nonCompliant: 'text-destructive'
	};

	const section = variant === 'compliant' ? 'compliant' : 'non-compliant';

	function toggleSection(section: 'compliant' | 'non-compliant') {
		if (collapsible) {
			open = !open;
			onSectionToggle(section);
		}
	}

	function toggleSortDirection() {
		sortDirection =
			sortDirection === SortDirections.Ascending
				? SortDirections.Descending
				: SortDirections.Ascending;
	}
</script>

<div class={container({ layout })} data-testid={`${section}-section`} id={`${section}-airlines`}>
	<details
		class="group h-full"
		{open}
		role="none"
		onclick={(e) => {
			e.preventDefault();
		}}
	>
		<summary class="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
			<button
				class={cn('flex items-center gap-2 font-semibold', buttonStyles[variant])}
				onclick={() => toggleSection(section)}
			>
				{#if collapsible}
					<div class="translate-y-[1px] xl:hidden">
						{#if open}
							<ChevronsDownUp class="h-5 w-5" />
						{:else}
							<ChevronsUpDown class="h-5 w-5" />
						{/if}
					</div>
				{/if}
				<h3 class="text-md inline-flex items-center gap-2 sm:text-lg">
					{#if variant === 'nonCompliant'}
						<CarryOnBagInactiveIcon class="h-6 w-6" />
					{:else}
						<CarryOnBagCheckedIcon class="h-6 w-6" />
					{/if}
					{variant === 'nonCompliant'
						? `Non-Compliant Airlines (${airlines.length})`
						: `Compliant Airlines (${airlines.length})`}
				</h3>
			</button>
		</summary>
		<div class={cn('mt-3 rounded-lg border p-4')}>
			<div class="mb-4 flex justify-end">
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
			</div>
			<div
				class={cn(
					'grid auto-rows-fr gap-4',
					layout === 'single-column' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
				)}
				style="contain: layout style;"
				data-testid={`${section}-cards`}
			>
				{#each airlines as airline, i (airline.airline + i)}
					<AirlineCard
						{airline}
						{measurementSystem}
						complianceResults={airline.complianceResults}
						isFavorite={favoriteAirlines.has(airline.airline)}
						{toggleFavorite}
					/>
				{/each}
			</div>
		</div>
	</details>
</div>
