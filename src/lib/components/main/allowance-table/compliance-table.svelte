<script lang="ts">
	import {
		type AirlineCompliance,
		type AirlineInfo,
		type MeasurementSystem,
		type SortDirection
	} from '$lib/types';
	import { ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
	import Header from './header.svelte';
	import Row from './row.svelte';
	import { CarryOnBagInactiveIcon } from '$lib/components/icons';
	import { tv } from 'tailwind-variants';
	import { cn } from '$lib/utils/styling';

	interface Props {
		airlines: AirlineCompliance[];
		measurementSystem: MeasurementSystem;
		open: boolean;
		layout: 'single' | 'multiple';
		variant: 'nonCompliant' | 'compliant';
		collapsible: boolean;
		sortDirection: SortDirection;
		toggleFavorite: (airline: string) => void;
		favoriteAirlines: Set<string>;
	}

	const table = tv({
		base: 'flex-1 ',
		variants: {
			compliant: {
				true: 'bg-emerald-50',
				false: 'bg-red-50'
			},
			layout: {
				single: 'xl:max-w-[50%]',
				multiple: ''
			}
		}
	});

	let {
		airlines,
		measurementSystem,
		open = $bindable(),
		layout = 'single',
		variant,
		collapsible,
		sortDirection = $bindable(),
		toggleFavorite,
		favoriteAirlines
	}: Props = $props();

	const buttonStyles = {
		compliant: 'text-emerald-700',
		nonCompliant: 'text-red-700'
	};

	const borderStyles = {
		compliant: 'border-emerald-200',
		nonCompliant: 'border-red-200'
	};

	const headerRowStyles = {
		compliant: 'bg-emerald-50',
		nonCompliant: 'bg-red-50'
	};
</script>

<div class={table({ layout })} data-testid="non-compliant-section" id="non-compliant-airlines">
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
				onclick={() => (open = !open)}
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
					<CarryOnBagInactiveIcon class="h-6 w-6" />
					{variant === 'nonCompliant'
						? `Non-Compliant Airlines (${airlines.length})`
						: `Compliant Airlines (${airlines.length})`}
				</h3>
			</button>
		</summary>
		<div class={cn('mt-3 rounded-lg border', borderStyles[variant])}>
			<div class="overflow-x-auto">
				<table class="w-full" data-testid="non-compliant-table">
					<thead>
						<tr class={headerRowStyles[variant]}>
							<Header {measurementSystem} bind:sortDirection />
						</tr>
					</thead>
					<tbody>
						{#each airlines as airline}
							<Row
								{airline}
								{measurementSystem}
								complianceResults={airline.complianceResults}
								isFavorite={favoriteAirlines.has(airline.airline)}
								{toggleFavorite}
							/>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</details>
</div>
