<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import { MeasurementSystems, type AirlineInfo, type MeasurementSystem } from '$lib/types';
	import { getAirlineDimensions } from '$lib/utils/mapping';
	import { MonitorCheck, MonitorOff, MonitorX, Star, StarOff } from 'lucide-svelte';
	import { tv } from 'tailwind-variants';
	import * as Table from '$lib/components/ui/table';

	const row = tv({
		base: 'text-base',
		variants: {
			compliant: {
				true: '',
				false: ''
			}
		}
	});

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

<Table.Row class={row({ compliant: complianceResults?.every(Boolean) ?? false })}>
	<Table.Cell>
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#if airline?.testResult?.success}
						<MonitorCheck size={16} class="text-green-600" />
					{:else if airline?.testResult?.success === false}
						<MonitorX size={16} class="text-destructive" />
					{:else}
						<MonitorOff size={16} class="text-muted-foreground" />
					{/if}
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>
						{#if airline?.testResult?.success}
							Passing since {airline?.testResult?.lastTest?.toLocaleDateString()}
						{:else if airline?.testResult?.success === false}
							Failing since {airline?.testResult?.lastTest?.toLocaleDateString()}
						{:else}
							No tests yet
						{/if}
					</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</Table.Cell>
	<Table.Cell>
		<div class="flex items-center gap-2">
			<button
				class="group flex items-center"
				onclick={() => toggleFavorite(airline.airline)}
				data-testid="favorite-button"
				data-favorite={isFavorite}
			>
				{#if isFavorite}
					<Star class="h-4 w-4 text-primary transition-colors hover:text-muted-foreground" />
				{:else}
					<StarOff class="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
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
