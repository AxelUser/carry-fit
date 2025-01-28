<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import { MeasurementSystems, type AirlineInfo, type MeasurementSystem } from '$lib/types';
	import { getAirlineDimensions } from '$lib/utils/mapping';
	import { MonitorCheck, MonitorOff, MonitorX, Star, StarOff } from 'lucide-svelte';
	import { tv } from 'tailwind-variants';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';

	const row = tv({
		base: 'border-t border-sky-100 hover:bg-sky-50',
		variants: {
			compliant: {
				true: 'bg-emerald-50',
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
						<MonitorX size={16} class="text-red-600" />
					{:else}
						<MonitorOff size={16} class="text-gray-600" />
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
					<Star class="h-4 w-4 text-amber-400 transition-colors group-hover:text-amber-500" />
				{:else}
					<StarOff class="h-4 w-4 text-sky-300 transition-colors group-hover:text-sky-400" />
				{/if}
			</button>
			{airline.airline}
		</div>
	</Table.Cell>
	<Table.Cell data-testid="region">{airline.region}</Table.Cell>
	<Table.Cell class="whitespace-nowrap" data-testid="dimensions">
		{#if carryOnDimensions.length === 1}
			<span class={complianceResults?.[0] === false ? 'text-red-600' : ''}>
				{`Total ${carryOnDimensions[0]}`}</span
			>
		{:else}
			<span class={complianceResults?.[0] === false ? 'text-red-600' : ''}
				>{carryOnDimensions[0]}</span
			>
			x
			<span class={complianceResults?.[1] === false ? 'text-red-600' : ''}
				>{carryOnDimensions[1]}</span
			>
			x
			<span class={complianceResults?.[2] === false ? 'text-red-600' : ''}
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
			<Button
				variant="link"
				size="sm"
				href={airline.link}
				target="_blank"
				rel="noopener noreferrer"
			>
				View
			</Button>
		{:else}
			N/A
		{/if}
	</Table.Cell>
</Table.Row>
