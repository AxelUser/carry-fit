<script lang="ts">
	import {
		MeasurementSystems,
		type AirlineInfo,
		type MeasurementSystem,
		type DimensionCompliance,
		type DimensionValue
	} from '$lib/types';
	import { getRelevantAirlineDimensions } from '$lib/utils/dimensions';
	import Star from '$lib/components/icons/lucide/star.svelte';
	import StarOff from '$lib/components/icons/lucide/star-off.svelte';
	import { cn } from '$lib/utils/styling';
	import { Separator } from '$lib/components/ui/separator';

	interface Props {
		airline: AirlineInfo;
		measurementSystem: MeasurementSystem;
		complianceResults?: DimensionCompliance[];
		personalItemComplianceResults?: DimensionCompliance[];
		isFavorite: boolean;
		toggleFavorite: (airline: string) => void;
	}

	let {
		airline,
		measurementSystem,
		complianceResults,
		personalItemComplianceResults,
		isFavorite,
		toggleFavorite
	}: Props = $props();

	const isMetric = $derived(measurementSystem === MeasurementSystems.Metric);
	const carryOnDimensions = $derived.by<DimensionValue>(() => {
		const dims = getRelevantAirlineDimensions(airline.carryon, measurementSystem);
		if (!dims) {
			throw new Error(
				`No carry-on dimensions provided in ${airline.airline} for measurement system ${measurementSystem}`
			);
		}
		return dims;
	});
	const personalItemDimensions = $derived.by<DimensionValue | undefined>(() => {
		return airline.personalItem
			? getRelevantAirlineDimensions(airline.personalItem, measurementSystem)
			: undefined;
	});
	const unit = $derived(isMetric ? 'cm' : 'in');
	const weightUnit = $derived(isMetric ? 'kg' : 'lb');
	const carryOnWeight = $derived(
		isMetric ? airline.carryon.weight?.kilograms : airline.carryon.weight?.pounds
	);
	const personalItemWeight = $derived(
		isMetric ? airline.personalItem?.weight?.kilograms : airline.personalItem?.weight?.pounds
	);
	const totalWeight = $derived(
		isMetric ? airline.totalWeight?.kilograms : airline.totalWeight?.pounds
	);

	const isCarryOnNonCompliant = $derived(
		complianceResults ? complianceResults.some((result) => !result?.passed) : false
	);
	const isPersonalItemNonCompliant = $derived(
		personalItemComplianceResults
			? personalItemComplianceResults.some((result) => !result?.passed)
			: false
	);
	const isFullyNonCompliant = $derived(isCarryOnNonCompliant && isPersonalItemNonCompliant);

	function formatDimension(value: number): string {
		return Number.isInteger(value) ? value.toString() : value.toFixed(1);
	}

	function formatDiff(diff: number): string {
		const formatted = Number.isInteger(diff) ? diff.toString() : diff.toFixed(1);
		return `+${formatted}`;
	}
</script>

{#snippet dimensions(
	icon: string,
	label: string,
	testId: string,
	dimensions: DimensionValue | string,
	weight?: number,
	complianceResults?: DimensionCompliance[]
)}
	<div class="flex h-full flex-col rounded-lg bg-muted/50 p-3" data-testid={testId}>
		<div class="mb-2 flex items-center gap-2">
			<span class="text-primary">{icon}</span>
			<span class="text-sm font-medium text-foreground">{label}</span>
		</div>
		<dl class="flex-1 space-y-1 text-sm">
			{#if typeof dimensions === 'string'}
				<p class="text-sm italic text-muted-foreground">{dimensions}</p>
			{:else if typeof dimensions === 'number'}
				<div class="flex justify-between">
					<dt class="text-muted-foreground">Total</dt>
					<dd
						class="font-medium"
						class:text-destructive={complianceResults?.[0] && !complianceResults?.[0]?.passed}
						data-testid="total-dimensions"
						data-dimension-status={complianceResults?.[0] && !complianceResults?.[0]?.passed
							? 'fail'
							: 'pass'}
					>
						{#if complianceResults?.[0] && !complianceResults?.[0]?.passed && complianceResults?.[0]?.diff > 0}
							<span class="mr-1 text-xs">({formatDiff(complianceResults?.[0]?.diff)})</span>
						{/if}
						{formatDimension(dimensions)}
						{unit}
					</dd>
				</div>
			{:else}
				<div class="flex justify-between">
					<dt class="text-muted-foreground">Length</dt>
					<dd
						class="font-medium"
						class:text-destructive={complianceResults?.[0] && !complianceResults?.[0]?.passed}
						data-testid="length"
						data-dimension-status={complianceResults?.[0] && !complianceResults?.[0]?.passed
							? 'fail'
							: 'pass'}
					>
						{#if complianceResults?.[0] && !complianceResults?.[0]?.passed && complianceResults?.[0]?.diff > 0}
							<span class="mr-1 text-xs">({formatDiff(complianceResults?.[0]?.diff)})</span>
						{/if}
						{formatDimension(dimensions[0])}
						{unit}
					</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-muted-foreground">Width</dt>
					<dd
						class="font-medium"
						class:text-destructive={complianceResults?.[1] && !complianceResults?.[1]?.passed}
						data-testid="width"
						data-dimension-status={complianceResults?.[1] && !complianceResults?.[1]?.passed
							? 'fail'
							: 'pass'}
					>
						{#if complianceResults?.[1] && !complianceResults?.[1]?.passed && complianceResults?.[1]?.diff > 0}
							<span class="mr-1 text-xs">({formatDiff(complianceResults?.[1]?.diff)})</span>
						{/if}
						{formatDimension(dimensions[1])}
						{unit}
					</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-muted-foreground">Depth</dt>
					<dd
						class="font-medium"
						class:text-destructive={complianceResults?.[2] && !complianceResults?.[2]?.passed}
						data-testid="depth"
						data-dimension-status={complianceResults?.[2] && !complianceResults?.[2]?.passed
							? 'fail'
							: 'pass'}
					>
						{#if complianceResults?.[2] && !complianceResults?.[2]?.passed && complianceResults?.[2]?.diff > 0}
							<span class="mr-1 text-xs">({formatDiff(complianceResults?.[2]?.diff)})</span>
						{/if}
						{formatDimension(dimensions[2])}
						{unit}
					</dd>
				</div>
			{/if}
		</dl>
		{#if weight || !totalWeight}
			<Separator orientation="horizontal" />
			<div class="mt-auto flex justify-between pt-1 text-sm">
				<dt class="text-muted-foreground">Weight</dt>
				<dd class="font-medium" data-testid="weight-limit">
					{#if weight}
						{weight}
						{weightUnit}
					{:else}
						N/A
					{/if}
				</dd>
			</div>
		{/if}
	</div>
{/snippet}

<article
	class={cn(
		'flex h-full flex-col rounded-xl border bg-card shadow-sm hover:shadow-md',
		isFullyNonCompliant ? 'border-destructive' : 'border-border'
	)}
	data-testid="airline-card"
	data-compliance={isFullyNonCompliant ? 'non-compliant' : 'compliant'}
>
	<header class="flex items-center justify-between border-b px-4 py-3">
		<div class="flex items-center gap-3">
			<button
				class="group flex items-center"
				onclick={() => toggleFavorite(airline.airline)}
				data-tour-id="favorite-button"
				data-testid="favorite-button"
				data-favorite={isFavorite}
				aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
			>
				{#if isFavorite}
					<Star size={18} class="text-amber-500 transition-colors hover:text-muted-foreground" />
				{:else}
					<StarOff size={18} class="text-muted-foreground transition-colors hover:text-amber-500" />
				{/if}
			</button>
			<h3 class="font-semibold text-foreground" data-testid="airline-name">{airline.airline}</h3>
		</div>
		<span class="text-xs text-muted-foreground" data-testid="region">{airline.region}</span>
	</header>

	<div class="flex flex-1 flex-col gap-2 p-2 xs:gap-3 xs:p-4">
		<div class="grid flex-1 grid-cols-2 gap-2 xs:gap-3">
			{@render dimensions(
				'💼',
				'Carry-on',
				'carryon-section',
				carryOnDimensions,
				carryOnWeight,
				complianceResults
			)}

			{@render dimensions(
				'👜',
				'Personal Item',
				'personal-item-section',
				personalItemDimensions ?? 'Must fit under seat.',
				personalItemWeight,
				personalItemComplianceResults
			)}
		</div>

		{#if totalWeight}
			<div class="rounded-lg bg-muted/50 p-3">
				<div class="flex justify-between text-sm">
					<dt class="text-muted-foreground">Total Weight</dt>
					<dd data-testid="total-weight" class="font-medium">{totalWeight} {weightUnit}</dd>
				</div>
			</div>
		{/if}
	</div>

	<footer class="mt-auto border-t px-4 py-2" data-tour-id="policy-link">
		<a
			class="text-sm text-primary hover:underline"
			href={airline.link}
			target="_blank"
			rel="noopener noreferrer"
			data-testid="policy-link"
		>
			View Policy ↗
		</a>
	</footer>
</article>
