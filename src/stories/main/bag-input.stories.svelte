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
				description: 'Whether to show the fill percentage control',
				control: 'boolean'
			},
			fillPercentage: {
				description: 'The fill percentage (70-100)',
				control: { type: 'number', min: 70, max: 100, step: 5 }
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
		fillPercentage: 100
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
		fillPercentage: 100
	}}
/>

<Story
	name="With Fill Percentage"
	args={{
		userDimensions: {
			width: 35,
			height: 55,
			depth: 23
		},
		measurementSystem: MeasurementSystems.Metric,
		showFlexibility: true,
		fillPercentage: 80
	}}
/>
