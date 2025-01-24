<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Info from '$lib/components/main/info.svelte';

	const { Story } = defineMeta({
		title: 'Main/Info',
		component: Info,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered'
		},
		argTypes: {
			coveredByTest: {
				description: 'The number of airlines covered by the automated test',
				control: 'number'
			},
			lastTestRun: {
				description: 'The date of the last test run',
				control: 'date'
			}
		}
	});

	const mockData = {
		coveredByTest: 25,
		lastTestRun: new Date('2024-03-20')
	};
</script>

<Story name="Default" args={mockData} />
