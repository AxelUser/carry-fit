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
	import MeasurementSystemSelect from './measurement-system-select.svelte';

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
		measurementSystem,
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
		<MeasurementSystemSelect
			value={measurementSystem}
			onChanged={(system) => {
				measurementSystem = system;
				onChanged();
			}}
		/>
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

	<div data-tour-id="bag-input" class="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
		<div class="flex flex-col gap-1.5">
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
		<div class="flex flex-col gap-1.5">
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
		<div class="flex flex-col gap-1.5">
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
	</div>

	<p class="mb-3 mt-1 text-center text-sm font-medium text-card-foreground/80">
		Don't worry about the order - we'll find the best fit
	</p>

	<div class="mt-2">
		<div class="flex items-center gap-2">
			<Checkbox id="flexibility" bind:checked={showFlexibility} />
			<Label for="flexibility">My Bag is Flexible</Label>
		</div>

		{#if showFlexibility}
			<div class="mt-3">
				<div class="flex flex-col items-center gap-4 px-2">
					<FlexibleSuitcase value={flexibility} {measurementSystem} max={flexibilityMaxValue} />
					<Slider
						type="single"
						bind:value={flexibility}
						min={0}
						max={flexibilityMaxValue}
						step={flexibilityStep}
					/>
					<p class="text-sm text-primary">Adjust for how much your bag can be squeezed to fit</p>
				</div>
			</div>
		{/if}
	</div>
</div>
