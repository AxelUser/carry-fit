<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { FlexibleSuitcase } from '$lib/components/misc';
	import { MeasurementSystems } from '$lib/types';

	const { Story } = defineMeta({
		title: 'Misc/FlexibleSuitcase',
		component: FlexibleSuitcase,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Suitcase component visualizes a value relative to a maximum using an animated suitcase metaphor. The suitcase compresses horizontally based on the value/max ratio, with hands pushing from both sides.'
				}
			}
		},
		argTypes: {
			value: {
				description: 'The current value to display',
				control: 'range'
			},
			measurementSystem: {
				description: 'The measurement system',
				control: 'select',
				options: Object.values(MeasurementSystems)
			},
			max: {
				description: 'The maximum value for scaling calculation',
				control: 'number'
			}
		}
	});

	const mockData = {
		value: 0,
		measurementSystem: MeasurementSystems.Metric,
		max: 100
	};
</script>

<Story name="Default" args={mockData} />

<Story name="Max Value" args={{ value: 8, measurementSystem: MeasurementSystems.Metric, max: 8 }} />

<Story
	name="Small Value"
	args={{ value: 1, measurementSystem: MeasurementSystems.Metric, max: 8 }}
/>

<Story
	name="Imperial"
	args={{ value: 0.5, measurementSystem: MeasurementSystems.Imperial, max: 3 }}
/>
