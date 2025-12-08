<script lang="ts">
	import { MeasurementSystems, type AirlineInfo, type MeasurementSystem } from '$lib/types';
	import { getAirlineDimensions } from '$lib/utils/mapping';
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

	const isMetric = $derived(measurementSystem === MeasurementSystems.Metric);
	const carryOnDimensions = $derived(getAirlineDimensions(airline.carryon, measurementSystem));
	const personalItemDimensions = $derived(
		airline.personalItem ? getAirlineDimensions(airline.personalItem, measurementSystem) : null
	);
	const unit = $derived(isMetric ? 'cm' : 'in');
	const weightUnit = $derived(isMetric ? 'kg' : 'lb');
	const weight = $derived(isMetric ? airline.kilograms : airline.pounds);

	const dim0Failed = $derived(complianceResults?.[0] === false);
	const dim1Failed = $derived(complianceResults?.[1] === false);
	const dim2Failed = $derived(complianceResults?.[2] === false);

	function formatDimension(value: number): string {
		return Number.isInteger(value) ? value.toString() : value.toFixed(1);
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
				{#if carryOnDimensions.length === 1}
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Total</dt>
						<dd class="font-medium" class:text-destructive={dim0Failed} data-testid="dimensions">
							{formatDimension(carryOnDimensions[0])}
							{unit}
						</dd>
					</div>
				{:else}
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Length</dt>
						<dd class="font-medium" class:text-destructive={dim0Failed} data-testid="dimensions">
							{formatDimension(carryOnDimensions[0])}
							{unit}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Width</dt>
						<dd class="font-medium" class:text-destructive={dim1Failed}>
							{formatDimension(carryOnDimensions[1])}
							{unit}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Depth</dt>
						<dd class="font-medium" class:text-destructive={dim2Failed}>
							{formatDimension(carryOnDimensions[2])}
							{unit}
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
