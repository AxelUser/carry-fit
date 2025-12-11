<script lang="ts">
	import { type AirlineCompliance, type MeasurementSystem } from '$lib/types';
	import AirlineCard from './airline-card.svelte';
	import { CarryOnBagCheckedIcon, CarryOnBagInactiveIcon } from '$lib/components/icons';
	import { tv } from 'tailwind-variants';
	import { cn } from '$lib/utils/styling';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	interface Props {
		airlines: AirlineCompliance[];
		measurementSystem: MeasurementSystem;
		layout: 'single-column' | 'two-column';
		variant: 'nonCompliant' | 'compliant';
		toggleFavorite: (airline: string) => void;
		favoriteAirlines: Set<string>;
		scrollable?: boolean;
	}

	const container = tv({
		base: 'w-full',
		variants: {
			layout: {
				'single-column': '',
				'two-column': ''
			}
		}
	});

	let {
		airlines,
		measurementSystem,
		layout,
		variant,
		toggleFavorite,
		favoriteAirlines,
		scrollable = false
	}: Props = $props();

	const buttonStyles = {
		compliant: 'text-emerald-700',
		nonCompliant: 'text-destructive'
	};

	const section = variant === 'compliant' ? 'compliant' : 'non-compliant';
</script>

<div class={container({ layout })} data-testid={`${section}-section`} id={`${section}-airlines`}>
	<div class="h-full w-full">
		<div class={cn('flex items-center gap-2 font-semibold', buttonStyles[variant])}>
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
		</div>
		<div class={cn('mt-3 h-full')}>
			{#if scrollable}
				<ScrollArea class="h-[560px] w-full pr-2">
					<div class="pb-2">
						<div
							class={cn(
								'grid auto-rows-fr gap-4',
								layout === 'single-column' ? 'md:grid-cols-2' : 'grid-cols-1'
							)}
							style="contain: layout style;"
							data-testid={`${section}-cards`}
						>
							{#each airlines as airline, i (airline.airline + i)}
								<AirlineCard
									{airline}
									{measurementSystem}
									complianceResults={airline.complianceResults}
									personalItemComplianceResults={airline.personalItemComplianceResults}
									isFavorite={favoriteAirlines.has(airline.airline)}
									{toggleFavorite}
								/>
							{/each}
						</div>
					</div>
				</ScrollArea>
			{:else}
				<div
					class={cn(
						'grid auto-rows-fr gap-4',
						layout === 'single-column' ? 'md:grid-cols-2' : 'grid-cols-1'
					)}
					style="contain: layout style;"
					data-testid={`${section}-cards`}
				>
					{#each airlines as airline, i (airline.airline + i)}
						<AirlineCard
							{airline}
							{measurementSystem}
							complianceResults={airline.complianceResults}
							personalItemComplianceResults={airline.personalItemComplianceResults}
							isFavorite={favoriteAirlines.has(airline.airline)}
							{toggleFavorite}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
