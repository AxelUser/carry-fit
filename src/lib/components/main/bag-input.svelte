<script lang="ts">
	import { X } from 'lucide-svelte';
	import { type MeasurementSystem, type UserDimensions } from '$lib/types';
	import { ShareBagLink, FlexibleSuitcase } from '$lib/components/misc';
	import { Delimiter } from '$lib/components/ui/delimiter';

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
		<h2 class="text-xl font-semibold text-sky-900">Bag Dimensions</h2>
		<div class="flex items-center gap-2">
			{#if allDimensionsSet}
				<ShareBagLink {userDimensions} {measurementSystem} />
			{/if}
			<button
				onclick={resetDimensions}
				class="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
			>
				<X size={12} class="mt-0.5" />
				<span>Reset</span>
			</button>
		</div>
	</div>

	<div class="grid grid-cols-3 gap-4">
		<div>
			<label for="height" class="mb-1 block text-sm font-medium text-sky-900">Height</label>
			<input
				type="number"
				id="height"
				value={userDimensions.height}
				oninput={(e) => {
					userDimensions.height = Number(e.currentTarget.value);
					onChanged();
				}}
				class="w-full rounded-lg border-sky-200 bg-sky-50 text-sm focus:border-sky-400 focus:ring-sky-400"
				min={0}
			/>
		</div>
		<div>
			<label for="width" class="mb-1 block text-sm font-medium text-sky-900">Width</label>
			<input
				type="number"
				id="width"
				value={userDimensions.width}
				oninput={(e) => {
					userDimensions.width = Number(e.currentTarget.value);
					onChanged();
				}}
				class="w-full rounded-lg border-sky-200 bg-sky-50 text-sm focus:border-sky-400 focus:ring-sky-400"
				min={0}
			/>
		</div>
		<div>
			<label for="depth" class="mb-1 block text-sm font-medium text-sky-900">Depth</label>
			<input
				type="number"
				id="depth"
				value={userDimensions.depth}
				oninput={(e) => {
					userDimensions.depth = Number(e.currentTarget.value);
					onChanged();
				}}
				class="w-full rounded-lg border-sky-200 bg-sky-50 text-sm focus:border-sky-400 focus:ring-sky-400"
				min={0}
			/>
		</div>
	</div>

	<p class="mb-4 mt-4 text-center text-sm font-medium text-sky-700">
		Don't worry about the order - we'll find the best fit
	</p>

	<Delimiter class="mb-4" />

	<div class="mt-4">
		<label class="inline-flex cursor-pointer items-center gap-2">
			<input
				type="checkbox"
				bind:checked={showFlexibility}
				class="form-checkbox rounded border-sky-300 text-sky-600 focus:ring-0 focus:ring-offset-0"
			/>
			<span class="text-sm font-medium text-sky-900">My Bag is Flexible</span>
		</label>

		{#if showFlexibility}
			<div class="mt-3">
				<div class="flex flex-col items-center gap-4">
					<FlexibleSuitcase value={flexibility} {measurementSystem} max={flexibilityMaxValue} />
					<div class="flex w-full items-center gap-4">
						<input
							id="flexibility"
							type="range"
							bind:value={flexibility}
							min="0"
							max={flexibilityMaxValue}
							step={flexibilityStep}
							class="h-2 flex-1 rounded-lg bg-sky-200 accent-sky-600"
						/>
					</div>
				</div>
				<p class="mt-2 text-xs text-sky-600">Adjust for how much your bag can be squeezed to fit</p>
			</div>
		{/if}
	</div>
</div>
