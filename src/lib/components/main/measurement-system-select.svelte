<script lang="ts">
	import { MeasurementSystems, type MeasurementSystem } from '$lib/types';
	import { Card } from '$lib/components/ui/card';
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

<div class="mx-auto mb-4 max-w-2xl">
	<Card class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h3 class="text-base font-medium text-sky-900">Measurement System</h3>
			<p class="text-sm text-sky-600">Choose your preferred unit of measurement</p>
		</div>
		<div class="grid grid-cols-2 gap-2">
			<Button
				class="flex flex-col items-center justify-center"
				variant={value === MeasurementSystems.Metric ? 'primary' : 'outline'}
				size="md"
				onclick={() => setValue(MeasurementSystems.Metric)}
				data-testid="imperial-button"
				data-active={value === MeasurementSystems.Metric}
			>
				<span>Metric</span>
				<span class="block text-xs text-sky-600">cm / kg</span>
			</Button>
			<Button
				class="flex flex-col items-center justify-center"
				variant={value === MeasurementSystems.Imperial ? 'primary' : 'outline'}
				size="md"
				onclick={() => setValue(MeasurementSystems.Imperial)}
				data-testid="imperial-button"
				data-active={value === MeasurementSystems.Imperial}
			>
				<span>Imperial</span>
				<span class="block text-xs text-sky-600">in / lb</span>
			</Button>
		</div>
	</Card>
</div>
