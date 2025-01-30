<script lang="ts">
	import { MeasurementSystems, type MeasurementSystem } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
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
	<Card.Root>
		<Card.Header>
			<Card.Title>Measurement System</Card.Title>
			<Card.Description>Choose your preferred units of measurement</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-2 gap-2">
				<Button
					class="flex flex-col items-center justify-center"
					variant={value === MeasurementSystems.Metric ? 'default' : 'outline'}
					size="lg"
					onclick={() => setValue(MeasurementSystems.Metric)}
					data-testid="metric-button"
					data-active={value === MeasurementSystems.Metric}
				>
					Metric (cm / kg)
				</Button>
				<Button
					class="flex flex-col items-center justify-center"
					variant={value === MeasurementSystems.Imperial ? 'default' : 'outline'}
					size="lg"
					onclick={() => setValue(MeasurementSystems.Imperial)}
					data-testid="imperial-button"
					data-active={value === MeasurementSystems.Imperial}
				>
					Imperial (in / lb)
				</Button>
			</div>
		</Card.Content>
	</Card.Root>
</div>
