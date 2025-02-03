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

<div class="relative mx-auto h-[84px] w-[112px]">
	<div class="relative flex h-full w-full flex-col items-center">
		<div class="z-[2] -mb-0.5 h-[14px] w-[28px] rounded-t-[20px] border-4 border-slate-600"></div>
		<div
			class="ease-[cubic-bezier(0.25,0.1,0.25,1)] relative flex h-[63px] w-[98px] items-center justify-center overflow-visible rounded-lg border-2 border-sky-500 bg-sky-600 transition-transform duration-200"
			style:transform="scaleX({scale})"
		>
			<!-- Left Hand Pushing Right -->
			<div
				class="absolute -left-8 top-1/2 -mt-4 -translate-y-1/2"
				style:transform="scaleX({1 / scale})"
			>
				<HandPushingRightwards class="text-slate-600" />
			</div>

			<!-- Right Hand Pushing Left -->
			<div
				class="absolute -right-8 top-1/2 -mt-4 -translate-y-1/2"
				style:transform="scaleX({1 / scale})"
			>
				<HandPushingLeftwards class="text-slate-600" />
			</div>

			<div
				class="z-[2] whitespace-nowrap text-base font-semibold text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.2)]"
				style:transform="scaleX({1 / scale})"
			>
				{value}
				{unit}
			</div>
			<div
				class="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_15px,rgba(255,255,255,0.1)_15px,rgba(255,255,255,0.1)_30px)]"
			></div>
			<div
				class="absolute left-[10px] right-[10px] top-1/2 h-px bg-black/10 before:absolute before:inset-x-0 before:-top-[20px] before:h-px before:bg-white/10 after:absolute after:inset-x-0 after:top-[20px] after:h-px after:bg-black/10"
			></div>
		</div>
	</div>
</div>
