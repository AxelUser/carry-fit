<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { BagInput } from '$lib/components/main';
	import { MeasurementSystems } from '$lib/types';

	const { Story } = defineMeta({
		title: 'Main/BagInput',
		component: BagInput,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered'
		},
		argTypes: {
			userDimensions: {
				description: 'The dimensions of the bag',
				control: 'object'
			},
			measurementSystem: {
				description: 'The current measurement system',
				control: 'select',
				options: Object.values(MeasurementSystems)
			},
			showFlexibility: {
				description: 'Whether to show the flexibility slider',
				control: 'boolean'
			},
			flexibility: {
				description: 'The amount of flexibility',
				control: 'number'
			},
			flexibilityMaxValue: {
				description: 'Maximum value for flexibility slider',
				control: 'number'
			},
			flexibilityStep: {
				description: 'Step value for flexibility slider',
				control: 'number'
			},
			onChanged: {
				description: 'Callback function when any value changes',
				action: 'changed'
			}
		}
	});
</script>

<Story
	name="Default"
	args={{
		userDimensions: {
			width: 0,
			height: 0,
			depth: 0
		},
		measurementSystem: MeasurementSystems.Metric,
		showFlexibility: false,
		flexibility: 0,
		flexibilityMaxValue: 10,
		flexibilityStep: 1
	}}
/>

<Story
	name="With Dimensions"
	args={{
		userDimensions: {
			width: 35,
			height: 55,
			depth: 23
		},
		measurementSystem: MeasurementSystems.Metric,
		showFlexibility: false,
		flexibility: 0,
		flexibilityMaxValue: 10,
		flexibilityStep: 1
	}}
/>

<Story
	name="With Flexibility"
	args={{
		userDimensions: {
			width: 35,
			height: 55,
			depth: 23
		},
		measurementSystem: MeasurementSystems.Metric,
		showFlexibility: true,
		flexibility: 5,
		flexibilityMaxValue: 10,
		flexibilityStep: 1
	}}
/>
