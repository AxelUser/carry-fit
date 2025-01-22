<script lang="ts">
	import { MeasurementSystems, type MeasurementSystem } from '$lib/types';

	interface Props {
		value: MeasurementSystem;
		onChanged: (value: MeasurementSystem) => void;
	}

	let { value = $bindable(), onChanged }: Props = $props();

	function setValue(system: MeasurementSystem) {
		value = system;
		onChanged(system);
	}
</script>

<div class="mx-auto mb-4 max-w-2xl">
	<div class="rounded-xl bg-white/95 p-4 shadow-xl ring-1 ring-sky-100">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h3 class="text-base font-medium text-sky-900">Measurement System</h3>
				<p class="text-sm text-sky-600">Choose your preferred unit of measurement</p>
			</div>
			<div class="grid grid-cols-2 gap-2">
				<button
					class="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                        {value === MeasurementSystems.Metric
						? 'bg-sky-100 text-sky-900'
						: 'bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50'}"
					onclick={() => setValue(MeasurementSystems.Metric)}
					data-testid="metric-button"
					data-active={value === MeasurementSystems.Metric}
				>
					<span>Metric</span>
					<span class="block text-xs text-sky-600">cm / kg</span>
				</button>
				<button
					class="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                        {value === MeasurementSystems.Imperial
						? 'bg-sky-100 text-sky-900'
						: 'bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50'}"
					onclick={() => setValue(MeasurementSystems.Imperial)}
					data-testid="imperial-button"
					data-active={value === MeasurementSystems.Imperial}
				>
					<span>Imperial</span>
					<span class="block text-xs text-sky-600">in / lb</span>
				</button>
			</div>
		</div>
	</div>
</div>
