<script lang="ts">
	import HandPushingLeftwards from '$lib/components/icons/hand-pushing-leftwards.svelte';
	import HandPushingRightwards from '$lib/components/icons/hand-pushing-rightwards.svelte';
	import { type MeasurementSystem, MeasurementSystems } from '$lib/types';

	interface Props {
		value: number;
		measurementSystem: MeasurementSystem;
		max: number;
	}

	let { value, measurementSystem, max }: Props = $props();
	const normalizedValue = $derived.by(() => {
		if (value < 0) {
			return 0;
		}
		if (value > max) {
			return max;
		}
		return value;
	});

	const scale = $derived(1 - (normalizedValue / max) * 0.3);
	const unit = $derived(measurementSystem === MeasurementSystems.Metric ? 'cm' : 'in');
</script>

<div class="relative mx-auto flex h-[84px] w-[112px] flex-col items-center">
	<div
		class="border-muted-foreground relative -mb-0.5 h-[14px] w-[28px] rounded-t-[20px] border-4"
	></div>
	<div
		class="border-primary bg-primary relative flex h-[63px] w-[98px] items-center justify-center overflow-visible rounded-lg border-2 transition-transform duration-200 ease-in-out"
		style:transform="scaleX({scale})"
	>
		<div class="absolute top-1/2 -left-8 -translate-y-1/2" style:transform="scaleX({1 / scale})">
			<HandPushingRightwards class="text-muted-foreground" />
		</div>

		<div class="absolute top-1/2 -right-8 -translate-y-1/2" style:transform="scaleX({1 / scale})">
			<HandPushingLeftwards class="text-muted-foreground" />
		</div>

		<div
			class="text-primary-foreground text-base font-semibold whitespace-nowrap"
			style:transform="scaleX({1 / scale})"
		>
			{value}
			{unit}
		</div>
	</div>
</div>
