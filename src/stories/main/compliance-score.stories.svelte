<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { ComplianceScore } from '$lib/components/main';

	const { Story } = defineMeta({
		title: 'Main/ComplianceScore',
		component: ComplianceScore,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered'
		},
		argTypes: {
			allAirlinesCount: {
				description: 'Total number of airlines',
				control: 'number'
			},
			compliantAirlinesCount: {
				description: 'Number of airlines that comply',
				control: 'number'
			}
		}
	});
</script>

<Story
	name="High Score"
	args={{
		allAirlinesCount: 10,
		compliantAirlinesCount: 9
	}}
/>

<Story
	name="Medium Score"
	args={{
		allAirlinesCount: 10,
		compliantAirlinesCount: 7
	}}
/>

<Story
	name="Low Score"
	args={{
		allAirlinesCount: 10,
		compliantAirlinesCount: 5
	}}
/>

<Story
	name="Zero Score"
	args={{
		allAirlinesCount: 10,
		compliantAirlinesCount: 0
	}}
/>

<Story
	name="No Airlines"
	args={{
		allAirlinesCount: 0,
		compliantAirlinesCount: 0
	}}
/>
