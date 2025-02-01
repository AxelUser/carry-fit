<script lang="ts">
	import { Eraser } from 'lucide-svelte';
	import { type MeasurementSystem, type UserDimensions } from '$lib/types';
	import { ShareBagLink, FlexibleSuitcase } from '$lib/components/misc';
	import { Label } from '../ui/label';
	import { Input } from '../ui/input';
	import { Separator } from '../ui/separator';
	import { Checkbox } from '../ui/checkbox';
	import { Slider } from '../ui/slider';
	import { badgeVariants } from '../ui/badge';
	import { cn } from '$lib/utils/styling';
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
		measurementSystem,
		showFlexibility = $bindable(),
		flexibility = $bindable(),
		flexibilityMaxValue,
		flexibilityStep,
		onChanged
	}: Props = $props();

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

	function handlePastedDimensions(dimensions: { height: number; width: number; depth: number }) {
		userDimensions.height = dimensions.height;
		userDimensions.width = dimensions.width;
		userDimensions.depth = dimensions.depth;
		onChanged();
	}
</script>

<div class="mb-4">
	<div class="mb-6 flex items-baseline justify-between">
		<h2 class="text-xl font-semibold sm:text-2xl">Bag Dimensions</h2>
		<div class="flex items-center gap-2">
			<PasteDimensionsDialog {measurementSystem} onDimensionsFound={handlePastedDimensions} />
			{#if allDimensionsSet}
				<ShareBagLink {userDimensions} {measurementSystem} />
			{/if}
			<button
				class={cn(badgeVariants({ variant: 'secondary' }), 'focus:ring-0 focus:ring-offset-0')}
				onclick={resetDimensions}
			>
				<Eraser class="mr-1 size-3" />
				<span>Clear</span>
			</button>
		</div>
	</div>

	<div class="grid grid-cols-3 gap-x-4 gap-y-2">
		<Label for="height">Height</Label>
		<Label class="mb-1" for="width">Width</Label>
		<Label for="depth">Depth</Label>
		<Input
			type="number"
			id="height"
			value={userDimensions.height}
			oninput={(e) => {
				userDimensions.height = Number(e.currentTarget.value);
				onChanged();
			}}
			min={0}
		/>
		<Input
			type="number"
			id="width"
			value={userDimensions.width}
			oninput={(e) => {
				userDimensions.width = Number(e.currentTarget.value);
				onChanged();
			}}
			min={0}
		/>
		<Input
			type="number"
			id="depth"
			value={userDimensions.depth}
			oninput={(e) => {
				userDimensions.depth = Number(e.currentTarget.value);
				onChanged();
			}}
			min={0}
		/>
	</div>

	<p class="mb-4 mt-4 text-center text-sm font-medium text-card-foreground/80">
		Don't worry about the order - we'll find the best fit
	</p>

	<Separator />

	<div class="mt-4">
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
