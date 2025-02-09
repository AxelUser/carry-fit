<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { AllowanceTable } from '$lib/components/main/allowance-table';
	import { MeasurementSystems, type AirlineCompliance, type AirlineInfo } from '$lib/types';

	const sampleAirlineInfo: AirlineInfo[] = [
		{
			airline: 'Sample Airline 1',
			carryon: { inches: 40, centimeters: 100 },
			region: 'Europe',
			link: 'https://www.sampleairline.com',
			pounds: 10,
			kilograms: 4.5
		},
		{
			airline: 'Sample Airline 2',
			carryon: { inches: [45, 50, 25], centimeters: [110, 125, 65] },
			region: 'Asia',
			link: 'https://www.sampleairline.com',
			pounds: 12,
			kilograms: 5.4
		}
	];

	const sampleCompliantAirlines: AirlineCompliance[] = [
		{
			airline: 'Compliant Airline 1',
			carryon: { inches: 40, centimeters: 100 },
			region: 'Europe',
			link: 'https://www.sampleairline.com',
			complianceResults: [true, true, true],
			pounds: 10,
			kilograms: 4.5
		},
		{
			airline: 'Compliant Airline 2',
			carryon: { inches: [45, 50, 25], centimeters: [110, 125, 65] },
			region: 'Asia',
			link: 'https://www.sampleairline.com',
			complianceResults: [true, true, true],
			pounds: 12,
			kilograms: 5.4
		}
	];

	const sampleNonCompliantAirlines: AirlineCompliance[] = [
		{
			airline: 'Non-Compliant Airline 1',
			carryon: { inches: [60, 70, 30], centimeters: [150, 175, 75] },
			region: 'South America',
			link: 'https://www.sampleairline.com',
			complianceResults: [false, true, false],
			pounds: 15,
			kilograms: 6.8
		}
	];

	const { Story } = defineMeta({
		title: 'Main/AllowanceTable',
		component: AllowanceTable,
		tags: ['autodocs'],
		parameters: {
			layout: 'padded'
		},
		argTypes: {
			measurementSystem: {
				description: 'Current measurement system',
				control: 'select',
				options: Object.values(MeasurementSystems)
			},
			favoriteAirlines: {
				description: 'Array of favorite airline names',
				control: 'object'
			},
			airlines: {
				description: 'Array of airline information',
				control: 'object'
			},
			compliantAirlines: {
				description: 'Array of compliant airlines with compliance results',
				control: 'object'
			},
			nonCompliantAirlines: {
				description: 'Array of non-compliant airlines with compliance results',
				control: 'object'
			},
			variant: {
				description: 'Layout variant',
				control: 'select',
				options: ['single-column', 'two-column']
			}
		}
	});
</script>

<Story
	name="Basic List"
	args={{
		measurementSystem: MeasurementSystems.Metric,
		favoriteAirlines: ['Sample Airline 1'],
		airlines: sampleAirlineInfo,
		compliantAirlines: [],
		nonCompliantAirlines: [],
		variant: 'single-column'
	}}
/>

<Story
	name="Two Column Layout With Compliance Results"
	args={{
		measurementSystem: MeasurementSystems.Metric,
		favoriteAirlines: [],
		airlines: [],
		compliantAirlines: sampleCompliantAirlines,
		nonCompliantAirlines: sampleNonCompliantAirlines,
		variant: 'two-column'
	}}
/>

<Story
	name="Imperial Measurements"
	args={{
		measurementSystem: MeasurementSystems.Imperial,
		favoriteAirlines: [],
		airlines: sampleAirlineInfo,
		compliantAirlines: [],
		nonCompliantAirlines: [],
		variant: 'single-column'
	}}
/>

<Story
	name="Empty State"
	args={{
		measurementSystem: MeasurementSystems.Metric,
		favoriteAirlines: [],
		airlines: [],
		compliantAirlines: [],
		nonCompliantAirlines: [],
		variant: 'single-column'
	}}
/>
