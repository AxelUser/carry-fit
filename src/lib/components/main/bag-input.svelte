<script lang="ts">
	import { Eraser } from 'lucide-svelte';
	import { type MeasurementSystem, type UserDimensions, MeasurementSystems } from '$lib/types';
	import { ShareBagLink, FlexibleSuitcase } from '$lib/components/misc';
	import { Label } from '../ui/label';
	import { Input } from '../ui/input';
	import { Checkbox } from '../ui/checkbox';
	import { Slider } from '../ui/slider';
	import { Button } from '../ui/button';
	import PasteDimensionsDialog from './paste-dimensions-dialog.svelte';

	interface Props {
		userDimensions: UserDimensions;
		measurementSystem: MeasurementSystem;
		showFlexibility: boolean;
		flexibility: number;
		flexibilityMaxValue: number;
		flexibilityStep: number;
		onChanged: () => void;
	}

	let {
		userDimensions = $bindable(),
		measurementSystem = $bindable(),
		showFlexibility = $bindable(),
		flexibility = $bindable(),
		flexibilityMaxValue,
		flexibilityStep,
		onChanged
	}: Props = $props();

	const unitLabel = $derived(measurementSystem === MeasurementSystems.Metric ? 'cm' : 'in');

	let allDimensionsSet = $derived(
		userDimensions.depth > 0 && userDimensions.width > 0 && userDimensions.height > 0
	);

	function resetDimensions() {
		userDimensions.depth = 0;
		userDimensions.width = 0;
		userDimensions.height = 0;
		showFlexibility = false;
		flexibility = 0;
	}

	function handlePastedDimensions(dimensions: UserDimensions) {
		userDimensions.height = dimensions.height;
		userDimensions.width = dimensions.width;
		userDimensions.depth = dimensions.depth;
		onChanged();
	}
</script>

<div class="mb-4">
	<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<div>
			<h2 class="text-xl font-semibold sm:text-2xl">Bag Dimensions</h2>
			<p class="text-sm text-muted-foreground">Enter manually or parse from a website</p>
		</div>
	</div>

	<div class="mb-3 flex flex-wrap items-center gap-2">
		{#if allDimensionsSet}
			<ShareBagLink {userDimensions} {measurementSystem} />
		{/if}
		<PasteDimensionsDialog {measurementSystem} onDimensionsFound={handlePastedDimensions} />
		<Button variant="ghost" size="sm" onclick={resetDimensions} class="gap-1">
			<Eraser class="size-4" />
			<span>Clear</span>
		</Button>
	</div>

	<div data-tour-id="bag-input" class="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
		<div class="order-2 flex flex-col gap-1.5 sm:order-1">
			<Label for="height">Height</Label>
			<div class="relative">
				<Input
					type="number"
					id="height"
					value={userDimensions.height}
					oninput={(e) => {
						userDimensions.height = Number(e.currentTarget.value);
						onChanged();
					}}
					min={0}
					class="pr-12"
				/>
				<span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
					{unitLabel}
				</span>
			</div>
		</div>
		<div class="order-3 flex flex-col gap-1.5 sm:order-2">
			<Label for="width">Width</Label>
			<div class="relative">
				<Input
					type="number"
					id="width"
					value={userDimensions.width}
					oninput={(e) => {
						userDimensions.width = Number(e.currentTarget.value);
						onChanged();
					}}
					min={0}
					class="pr-12"
				/>
				<span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
					{unitLabel}
				</span>
			</div>
		</div>
		<div class="order-4 flex flex-col gap-1.5 sm:order-3">
			<Label for="depth">Depth</Label>
			<div class="relative">
				<Input
					type="number"
					id="depth"
					value={userDimensions.depth}
					oninput={(e) => {
						userDimensions.depth = Number(e.currentTarget.value);
						onChanged();
					}}
					min={0}
					class="pr-12"
				/>
				<span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
					{unitLabel}
				</span>
			</div>
		</div>
		<div class="order-1 col-span-3 flex flex-col gap-1.5 sm:order-4 sm:col-span-1">
			<Label>Units</Label>
			<div
				data-tour-id="measurement-system-select"
				class="flex w-full items-center gap-2 bg-card py-1"
			>
				<Button
					variant={measurementSystem === MeasurementSystems.Metric ? 'default' : 'outline'}
					size="sm"
					class="flex-1 justify-center px-3"
					onclick={() => {
						measurementSystem = MeasurementSystems.Metric;
						onChanged();
					}}
					data-testid="metric-button"
					data-active={measurementSystem === MeasurementSystems.Metric}
				>
					cm/kg
				</Button>
				<Button
					variant={measurementSystem === MeasurementSystems.Imperial ? 'default' : 'outline'}
					size="sm"
					class="flex-1 justify-center px-3"
					onclick={() => {
						measurementSystem = MeasurementSystems.Imperial;
						onChanged();
					}}
					data-testid="imperial-button"
					data-active={measurementSystem === MeasurementSystems.Imperial}
				>
					in/lb
				</Button>
			</div>
		</div>
	</div>

	<p class="mb-3 mt-3 text-center text-sm font-medium text-card-foreground/80">
		Don't worry about the order - we'll find the best fit
	</p>

	<div class="mt-2">
		<div class="flex items-center gap-2">
			<Checkbox id="flexibility" bind:checked={showFlexibility} />
			<Label for="flexibility">My Bag is Flexible</Label>
		</div>

		{#if showFlexibility}
			<div class="mt-3 flex flex-col items-center gap-4 px-2">
				<FlexibleSuitcase value={flexibility} {measurementSystem} max={flexibilityMaxValue} />
				<div class="mx-auto w-full max-w-[360px]">
					<Slider
						class="w-full"
						type="single"
						bind:value={flexibility}
						min={0}
						max={flexibilityMaxValue}
						step={flexibilityStep}
					/>
				</div>
				<p class="text-sm text-primary">Adjust for how much your bag can be squeezed to fit</p>
			</div>
		{/if}
	</div>
</div>
