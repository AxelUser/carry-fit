<script lang="ts">
	import {
		MeasurementSystems,
		type AirlineInfo,
		type MeasurementSystem,
		type DimensionCompliance
	} from '$lib/types';
	import { getAirlineDimensions } from '$lib/utils/mapping';
	import Star from '$lib/components/icons/lucide/star.svelte';
	import StarOff from '$lib/components/icons/lucide/star-off.svelte';

	interface Props {
		airline: AirlineInfo;
		measurementSystem: MeasurementSystem;
		complianceResults?: DimensionCompliance[];
		isFavorite: boolean;
		toggleFavorite: (airline: string) => void;
	}

	let { airline, measurementSystem, complianceResults, isFavorite, toggleFavorite }: Props =
		$props();

	const isMetric = $derived(measurementSystem === MeasurementSystems.Metric);
	const carryOnDimensions = $derived(getAirlineDimensions(airline.carryon, measurementSystem));
	const sortedCarryOnDimensions = $derived(
		carryOnDimensions.length > 1 ? carryOnDimensions.toSorted((a, b) => b - a) : carryOnDimensions
	);
	const personalItemDimensions = $derived(
		airline.personalItem ? getAirlineDimensions(airline.personalItem, measurementSystem) : null
	);
	const unit = $derived(isMetric ? 'cm' : 'in');
	const weightUnit = $derived(isMetric ? 'kg' : 'lb');
	const weight = $derived(isMetric ? airline.kilograms : airline.pounds);

	const dim0 = $derived(complianceResults?.[0]);
	const dim1 = $derived(complianceResults?.[1]);
	const dim2 = $derived(complianceResults?.[2]);

	function formatDimension(value: number): string {
		return Number.isInteger(value) ? value.toString() : value.toFixed(1);
	}

	function formatDiff(diff: number): string {
		const formatted = Number.isInteger(diff) ? diff.toString() : diff.toFixed(1);
		return `+${formatted}`;
	}
</script>

<article
	class="flex h-full flex-col rounded-xl border bg-card shadow-sm hover:shadow-md"
	style="contain: content; content-visibility: auto; contain-intrinsic-size: auto 280px;"
	data-testid="airline-card"
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

	<div class="grid flex-1 grid-cols-1 gap-3 p-4 sm:grid-cols-2">
		<div class="rounded-lg bg-muted/50 p-3" data-testid="carryon-section">
			<div class="mb-2 flex items-center gap-2">
				<span class="text-primary">💼</span>
				<span class="text-sm font-medium text-foreground">Carry-on</span>
			</div>
			<dl class="space-y-1 text-sm">
				{#if sortedCarryOnDimensions.length === 1}
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Total</dt>
						<dd
							class="font-medium"
							class:text-destructive={dim0 && !dim0.passed}
							data-testid="dimensions"
						>
							{#if dim0 && !dim0.passed && dim0.diff > 0}
								<span class="mr-1 text-xs">({formatDiff(dim0.diff)})</span>
							{/if}
							{formatDimension(sortedCarryOnDimensions[0])} {unit}
						</dd>
					</div>
				{:else}
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Length</dt>
						<dd
							class="font-medium"
							class:text-destructive={dim0 && !dim0.passed}
							data-testid="dimensions"
						>
							{#if dim0 && !dim0.passed && dim0.diff > 0}
								<span class="mr-1 text-xs">({formatDiff(dim0.diff)})</span>
							{/if}
							{formatDimension(sortedCarryOnDimensions[0])} {unit}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Width</dt>
						<dd class="font-medium" class:text-destructive={dim1 && !dim1.passed}>
							{#if dim1 && !dim1.passed && dim1.diff > 0}
								<span class="mr-1 text-xs">({formatDiff(dim1.diff)})</span>
							{/if}
							{formatDimension(sortedCarryOnDimensions[1])} {unit}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Depth</dt>
						<dd class="font-medium" class:text-destructive={dim2 && !dim2.passed}>
							{#if dim2 && !dim2.passed && dim2.diff > 0}
								<span class="mr-1 text-xs">({formatDiff(dim2.diff)})</span>
							{/if}
							{formatDimension(sortedCarryOnDimensions[2])} {unit}
						</dd>
					</div>
				{/if}
				<div class="flex justify-between border-t border-border/50 pt-1">
					<dt class="text-muted-foreground">Weight</dt>
					<dd class="font-medium" data-testid="weight-limit">
						{#if weight}
							{weight} {weightUnit}
						{:else}
							<span class="text-muted-foreground">N/A</span>
						{/if}
					</dd>
				</div>
			</dl>
		</div>

		<div class="rounded-lg bg-muted/50 p-3" data-testid="personal-item-section">
			<div class="mb-2 flex items-center gap-2">
				<span class="text-secondary-foreground">👜</span>
				<span class="text-sm font-medium text-foreground">Personal Item</span>
			</div>
			{#if personalItemDimensions && personalItemDimensions.length > 0}
				<dl class="space-y-1 text-sm">
					{#if personalItemDimensions.length === 1}
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Total</dt>
							<dd class="font-medium">{formatDimension(personalItemDimensions[0])} {unit}</dd>
						</div>
					{:else}
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Length</dt>
							<dd class="font-medium">{formatDimension(personalItemDimensions[0])} {unit}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Width</dt>
							<dd class="font-medium">{formatDimension(personalItemDimensions[1])} {unit}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Depth</dt>
							<dd class="font-medium">{formatDimension(personalItemDimensions[2])} {unit}</dd>
						</div>
					{/if}
				</dl>
			{:else}
				<p class="text-sm italic text-muted-foreground">Must fit under seat.</p>
			{/if}
		</div>
	</div>

	<footer class="mt-auto border-t px-4 py-2" data-tour-id="policy-link">
		{#if airline.link}
			<a
				class="text-sm text-primary hover:underline"
				href={airline.link}
				target="_blank"
				rel="noopener noreferrer"
				data-testid="policy-link"
			>
				View Policy ↗
			</a>
		{:else}
			<span class="text-sm text-muted-foreground">No policy link</span>
		{/if}
	</footer>
</article>
