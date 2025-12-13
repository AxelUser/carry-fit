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
		personalItemComplianceResults?: DimensionCompliance[] | null;
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
		airline.personalItem?.weight
			? isMetric
				? airline.personalItem.weight.kilograms
				: airline.personalItem.weight.pounds
			: undefined
	);
	const totalWeight = $derived(
		airline.totalWeight
			? isMetric
				? airline.totalWeight.kilograms
				: airline.totalWeight.pounds
			: undefined
	);

	const dim0 = $derived(complianceResults?.[0]);
	const dim1 = $derived(complianceResults?.[1]);
	const dim2 = $derived(complianceResults?.[2]);

	const personalItemDim0 = $derived(personalItemComplianceResults?.[0]);
	const personalItemDim1 = $derived(personalItemComplianceResults?.[1]);
	const personalItemDim2 = $derived(personalItemComplianceResults?.[2]);

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

	<div class="grid flex-1 grid-cols-1 gap-3 p-4 sm:grid-cols-2">
		<div class="flex h-full flex-col rounded-lg bg-muted/50 p-3" data-testid="carryon-section">
			<div class="mb-2 flex items-center gap-2">
				<span class="text-primary">💼</span>
				<span class="text-sm font-medium text-foreground">Carry-on</span>
			</div>
			<dl class="flex-1 space-y-1 text-sm">
				{#if typeof carryOnDimensions === 'number'}
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Total</dt>
						<dd
							class="font-medium"
							class:text-destructive={dim0 && !dim0.passed}
							data-testid="total-dimensions"
							data-dimension-status={dim0 && !dim0.passed ? 'fail' : 'pass'}
						>
							{#if dim0 && !dim0.passed && dim0.diff > 0}
								<span class="mr-1 text-xs">({formatDiff(dim0.diff)})</span>
							{/if}
							{formatDimension(carryOnDimensions)}
							{unit}
						</dd>
					</div>
				{:else}
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Length</dt>
						<dd
							class="font-medium"
							class:text-destructive={dim0 && !dim0.passed}
							data-testid="length"
							data-dimension-status={dim0 && !dim0.passed ? 'fail' : 'pass'}
						>
							{#if dim0 && !dim0.passed && dim0.diff > 0}
								<span class="mr-1 text-xs">({formatDiff(dim0.diff)})</span>
							{/if}
							{formatDimension(carryOnDimensions[0])}
							{unit}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Width</dt>
						<dd
							class="font-medium"
							class:text-destructive={dim1 && !dim1.passed}
							data-testid="width"
							data-dimension-status={dim1 && !dim1.passed ? 'fail' : 'pass'}
						>
							{#if dim1 && !dim1.passed && dim1.diff > 0}
								<span class="mr-1 text-xs">({formatDiff(dim1.diff)})</span>
							{/if}
							{formatDimension(carryOnDimensions[1])}
							{unit}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Depth</dt>
						<dd
							class="font-medium"
							class:text-destructive={dim2 && !dim2.passed}
							data-testid="depth"
							data-dimension-status={dim2 && !dim2.passed ? 'fail' : 'pass'}
						>
							{#if dim2 && !dim2.passed && dim2.diff > 0}
								<span class="mr-1 text-xs">({formatDiff(dim2.diff)})</span>
							{/if}
							{formatDimension(carryOnDimensions[2])}
							{unit}
						</dd>
					</div>
				{/if}
			</dl>
			{#if carryOnWeight}
				<Separator orientation="horizontal" />
				<div class="mt-auto flex justify-between pt-1 text-sm">
					<dt class="text-muted-foreground">Weight</dt>
					<dd class="font-medium" data-testid="weight-limit">
						{carryOnWeight}
						{weightUnit}
					</dd>
				</div>
			{/if}
		</div>

		<div
			class="flex h-full flex-col rounded-lg bg-muted/50 p-3"
			data-testid="personal-item-section"
		>
			<div class="mb-2 flex items-center gap-2">
				<span class="text-secondary-foreground">👜</span>
				<span class="text-sm font-medium text-foreground">Personal Item</span>
			</div>
			<dl class="flex-1 space-y-1 text-sm">
				{#if personalItemDimensions}
					{#if typeof personalItemDimensions === 'number'}
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Total</dt>
							<dd
								class="font-medium"
								class:text-destructive={personalItemDim0 && !personalItemDim0.passed}
								data-testid="total-dimensions"
								data-dimension-status={personalItemDim0 && !personalItemDim0.passed
									? 'fail'
									: 'pass'}
							>
								{#if personalItemDim0 && !personalItemDim0.passed && personalItemDim0.diff > 0}
									<span class="mr-1 text-xs">({formatDiff(personalItemDim0.diff)})</span>
								{/if}
								{formatDimension(personalItemDimensions)}
								{unit}
							</dd>
						</div>
					{:else}
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Length</dt>
							<dd
								class="font-medium"
								class:text-destructive={personalItemDim0 && !personalItemDim0.passed}
								data-testid="length"
								data-dimension-status={personalItemDim0 && !personalItemDim0.passed
									? 'fail'
									: 'pass'}
							>
								{#if personalItemDim0 && !personalItemDim0.passed && personalItemDim0.diff > 0}
									<span class="mr-1 text-xs">({formatDiff(personalItemDim0.diff)})</span>
								{/if}
								{formatDimension(personalItemDimensions[0])}
								{unit}
							</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Width</dt>
							<dd
								class="font-medium"
								class:text-destructive={personalItemDim1 && !personalItemDim1.passed}
								data-testid="width"
								data-dimension-status={personalItemDim1 && !personalItemDim1.passed
									? 'fail'
									: 'pass'}
							>
								{#if personalItemDim1 && !personalItemDim1.passed && personalItemDim1.diff > 0}
									<span class="mr-1 text-xs">({formatDiff(personalItemDim1.diff)})</span>
								{/if}
								{formatDimension(personalItemDimensions[1])}
								{unit}
							</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Depth</dt>
							<dd
								class="font-medium"
								class:text-destructive={personalItemDim2 && !personalItemDim2.passed}
								data-testid="depth"
								data-dimension-status={personalItemDim2 && !personalItemDim2.passed
									? 'fail'
									: 'pass'}
							>
								{#if personalItemDim2 && !personalItemDim2.passed && personalItemDim2.diff > 0}
									<span class="mr-1 text-xs">({formatDiff(personalItemDim2.diff)})</span>
								{/if}
								{formatDimension(personalItemDimensions[2])}
								{unit}
							</dd>
						</div>
					{/if}
				{:else}
					<p class="text-sm italic text-muted-foreground">Must fit under seat.</p>
				{/if}
			</dl>
			{#if personalItemWeight}
				<div class="mt-auto flex justify-between border-t border-border/50 pt-1 text-sm">
					<dt class="text-muted-foreground">Weight</dt>
					<dd class="font-medium" data-testid="weight-limit">
						{personalItemWeight}
						{weightUnit}
					</dd>
				</div>
			{/if}
		</div>

		{#if totalWeight}
			<div class="col-span-1 rounded-lg bg-muted/50 p-3 sm:col-span-2">
				<div class="flex justify-between text-sm">
					<dt class="text-muted-foreground">Total Weight</dt>
					<dd data-testid="total-weight" class="font-medium">{totalWeight} {weightUnit}</dd>
				</div>
			</div>
		{/if}
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
