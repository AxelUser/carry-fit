<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Info } from '$lib/components/main';

	const { Story } = defineMeta({
		title: 'Main/Info',
		component: Info,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered'
		},
		argTypes: {}
	});
</script>

<Story name="Default" />
