<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { AllowanceTable } from '$lib/components/main/allowance-table';
	import { MeasurementSystems, type AirlineCompliance, type AirlineInfo } from '$lib/types';
	import { descDimensions } from '$lib/utils/dimensions';

	const sampleAirlineInfo: AirlineInfo[] = [
		{
			airline: 'Sample Airline 1',
			carryon: { inches: 40, centimeters: 100, weight: { pounds: 10, kilograms: 4.5 } },
			region: 'Europe',
			link: 'https://www.sampleairline.com'
		},
		{
			airline: 'Sample Airline 2',
			carryon: {
				inches: descDimensions([45, 50, 25]),
				centimeters: descDimensions([110, 125, 65]),
				weight: { pounds: 12, kilograms: 5.4 }
			},
			region: 'Asia',
			link: 'https://www.sampleairline.com'
		}
	];

	const sampleCompliantAirlines: AirlineCompliance[] = [
		{
			airline: 'Compliant Airline 1',
			carryon: { inches: 40, centimeters: 100, weight: { pounds: 10, kilograms: 4.5 } },
			region: 'Europe',
			link: 'https://www.sampleairline.com',
			complianceResults: [{ passed: true, diff: 0 }],
			personalItemComplianceResults: [{ passed: true, diff: 0 }]
		},
		{
			airline: 'Compliant Airline 2',
			carryon: {
				inches: descDimensions([45, 50, 25]),
				centimeters: descDimensions([110, 125, 65]),
				weight: { pounds: 12, kilograms: 5.4 }
			},
			region: 'Asia',
			link: 'https://www.sampleairline.com',
			complianceResults: [
				{ passed: true, diff: 0 },
				{ passed: true, diff: 0 },
				{ passed: true, diff: 0 }
			],
			personalItemComplianceResults: [
				{ passed: true, diff: 0 },
				{ passed: true, diff: 0 },
				{ passed: true, diff: 0 }
			]
		}
	];

	const sampleNonCompliantAirlines: AirlineCompliance[] = [
		{
			airline: 'Non-Compliant Airline 1',
			carryon: {
				inches: descDimensions([60, 70, 30]),
				centimeters: descDimensions([150, 175, 75]),
				weight: { pounds: 15, kilograms: 6.8 }
			},
			region: 'South America',
			link: 'https://www.sampleairline.com',
			complianceResults: [
				{ passed: false, diff: 5 },
				{ passed: true, diff: 0 },
				{ passed: false, diff: 3 }
			],
			personalItemComplianceResults: [
				{ passed: false, diff: 2 },
				{ passed: true, diff: 0 },
				{ passed: false, diff: 1 }
			]
		}
	];

	const sampleComplianceAirlines = [...sampleCompliantAirlines, ...sampleNonCompliantAirlines];

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
			complianceAirlines: {
				description: 'Array of airlines with compliance results',
				control: 'object'
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
		complianceAirlines: []
	}}
/>

<Story
	name="With Compliance Toggle"
	args={{
		measurementSystem: MeasurementSystems.Metric,
		favoriteAirlines: [],
		airlines: sampleAirlineInfo,
		complianceAirlines: sampleComplianceAirlines
	}}
/>

<Story
	name="Imperial Measurements"
	args={{
		measurementSystem: MeasurementSystems.Imperial,
		favoriteAirlines: [],
		airlines: sampleAirlineInfo,
		complianceAirlines: []
	}}
/>

<Story
	name="Empty State"
	args={{
		measurementSystem: MeasurementSystems.Metric,
		favoriteAirlines: [],
		airlines: [],
		complianceAirlines: []
	}}
/>
