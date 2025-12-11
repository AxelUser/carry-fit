<script lang="ts">
	import { MeasurementSystems, type MeasurementSystem } from '$lib/types';
	import { Button } from '../ui/button';

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

<div
	data-tour-id="measurement-system-select"
	class="inline-flex items-center gap-2 rounded-lg border bg-card px-2 py-1 shadow-sm"
>
	<Button
		variant={value === MeasurementSystems.Metric ? 'default' : 'ghost'}
		size="sm"
		class="px-3"
		onclick={() => setValue(MeasurementSystems.Metric)}
		data-testid="metric-button"
		data-active={value === MeasurementSystems.Metric}
	>
		Metric (cm/kg)
	</Button>
	<Button
		variant={value === MeasurementSystems.Imperial ? 'default' : 'ghost'}
		size="sm"
		class="px-3"
		onclick={() => setValue(MeasurementSystems.Imperial)}
		data-testid="imperial-button"
		data-active={value === MeasurementSystems.Imperial}
	>
		Imperial (in/lb)
	</Button>
</div>
