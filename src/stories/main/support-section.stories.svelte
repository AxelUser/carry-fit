<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { SupportSection } from '$lib/components/main';

	const { Story } = defineMeta({
		title: 'Main/SupportSection',
		component: SupportSection,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered'
		}
	});
</script>

<Story name="Default">
	{#snippet children(args)}
		<div class="w-[600px]">
			<SupportSection {...args} />
		</div>
	{/snippet}
</Story>
