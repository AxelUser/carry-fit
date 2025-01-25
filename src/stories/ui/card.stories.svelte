<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Card } from '$lib/components/ui/card';

	const { Story } = defineMeta({
		title: 'UI/Card',
		component: Card,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered'
		}
	});
</script>

<Story name="Default">
	{#snippet children(args)}
		<Card {...args}>
			<p>This is a default card with some content.</p>
		</Card>
	{/snippet}
</Story>

<Story name="Warning" args={{ variant: 'warning' }}>
	{#snippet children(args)}
		<Card {...args}>
			<p>This is a warning card with some content.</p>
		</Card>
	{/snippet}
</Story>

<Story name="Collapsible" args={{ collapsible: true, title: 'Collapsible Card' }}>
	{#snippet children(args)}
		<Card {...args}>
			<p>This is a collapsible card with some content.</p>
		</Card>
	{/snippet}
</Story>
