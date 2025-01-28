<script lang="ts">
	import { X } from 'lucide-svelte';
	import { type MeasurementSystem, type UserDimensions } from '$lib/types';
	import { ShareBagLink, FlexibleSuitcase } from '$lib/components/misc';
	import { Button } from '../ui/button';
	import { Label } from '../ui/label';
	import { Input } from '../ui/input';
	import { Separator } from '../ui/separator';
	import { Checkbox } from '../ui/checkbox';
	import { Slider } from '../ui/slider';

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
</script>

<div class="mb-4">
	<div class="mb-6 flex items-baseline justify-between">
		<h2 class="text-2xl font-semibold">Bag Dimensions</h2>
		<div class="flex items-center gap-2">
			{#if allDimensionsSet}
				<ShareBagLink {userDimensions} {measurementSystem} />
			{/if}
			<Button variant="secondary" size="sm" onclick={resetDimensions}>
				<X class="h-3 w-3" />
				<span>Reset</span>
			</Button>
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

	<p class="mb-4 mt-4 text-center text-sm font-medium text-primary">
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
