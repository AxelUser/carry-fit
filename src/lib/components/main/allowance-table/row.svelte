<script lang="ts">
	import { MeasurementSystems, type AirlineInfo, type MeasurementSystem } from '$lib/types';
	import { getAirlineDimensions } from '$lib/utils/mapping';

	import * as Table from '$lib/components/ui/table';
	import MonitorCheck from '$lib/components/icons/lucide/monitor-check.svelte';
	import MonitorX from '$lib/components/icons/lucide/monitor-x.svelte';
	import MonitorOff from '$lib/components/icons/lucide/monitor-off.svelte';
	import Star from '$lib/components/icons/lucide/star.svelte';
	import StarOff from '$lib/components/icons/lucide/star-off.svelte';

	interface Props {
		airline: AirlineInfo;
		measurementSystem: MeasurementSystem;
		complianceResults?: boolean[];
		isFavorite: boolean;
		toggleFavorite: (airline: string) => void;
	}

	let { airline, measurementSystem, complianceResults, isFavorite, toggleFavorite }: Props =
		$props();

	const carryOnDimensions = $derived(getAirlineDimensions(airline.carryon, measurementSystem));
</script>

<Table.Row class="text-base">
	<Table.Cell>
		{#if airline?.testResult?.success}
			<MonitorCheck size={16} class="text-green-600" />
		{:else if airline?.testResult?.success === false}
			<MonitorX size={16} class="text-destructive" />
		{:else}
			<MonitorOff size={16} class="text-muted-foreground" />
		{/if}
	</Table.Cell>
	<Table.Cell data-testid="airline-name">
		<div class="flex items-center gap-2">
			<button
				class="group flex items-center"
				onclick={() => toggleFavorite(airline.airline)}
				data-testid="favorite-button"
				data-favorite={isFavorite}
			>
				{#if isFavorite}
					<Star size={16} class="text-primary transition-colors hover:text-muted-foreground" />
				{:else}
					<StarOff size={16} class="text-muted-foreground transition-colors hover:text-primary" />
				{/if}
			</button>
			{airline.airline}
		</div>
	</Table.Cell>
	<Table.Cell data-testid="region">{airline.region}</Table.Cell>
	<Table.Cell class="whitespace-nowrap" data-testid="dimensions">
		{#if carryOnDimensions.length === 1}
			<span class={complianceResults?.[0] === false ? 'text-destructive' : ''}>
				{`Total ${carryOnDimensions[0]}`}</span
			>
		{:else}
			<span class={complianceResults?.[0] === false ? 'text-destructive' : ''}
				>{carryOnDimensions[0]}</span
			>
			x
			<span class={complianceResults?.[1] === false ? 'text-destructive' : ''}
				>{carryOnDimensions[1]}</span
			>
			x
			<span class={complianceResults?.[2] === false ? 'text-destructive' : ''}
				>{carryOnDimensions[2]}</span
			>
		{/if}
	</Table.Cell>
	<Table.Cell data-testid="weight-limit">
		{#if airline.kilograms}
			{measurementSystem === MeasurementSystems.Metric
				? `${airline.kilograms} kg`
				: `${airline.pounds} lb`}
		{:else}
			N/A
		{/if}
	</Table.Cell>
	<Table.Cell data-testid="policy-link">
		{#if airline.link}
			<a
				class="text-primary hover:underline"
				href={airline.link}
				target="_blank"
				rel="noopener noreferrer"
			>
				View
			</a>
		{:else}
			N/A
		{/if}
	</Table.Cell>
</Table.Row>
