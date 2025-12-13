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
			carryOnScore: {
				description: 'Carry-on compliance score (0-100)',
				control: { type: 'number', min: 0, max: 100 }
			},
			personalItemScore: {
				description: 'Personal item compliance score (0-100)',
				control: { type: 'number', min: 0, max: 100 }
			}
		}
	});
</script>

<Story
	name="Validators Fear This Bag"
	args={{
		carryOnScore: 95,
		personalItemScore: 98
	}}
/>

<Story
	name="Solid Travel Companion"
	args={{
		carryOnScore: 85,
		personalItemScore: 82
	}}
/>

<Story
	name="Overhead Hero, Underseat Zero"
	args={{
		carryOnScore: 95,
		personalItemScore: 45
	}}
/>

<Story
	name="Tight Squeeze"
	args={{
		carryOnScore: 65,
		personalItemScore: 70
	}}
/>

<Story
	name="Living Dangerously"
	args={{
		carryOnScore: 45,
		personalItemScore: 35
	}}
/>
