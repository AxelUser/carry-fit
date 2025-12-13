<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { ClickSplash } from '$lib/components/ui/click-splash';
	import { Button } from '$lib/components/ui/button';

	const { Story } = defineMeta({
		title: 'UI/ClickSplash',
		component: ClickSplash,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
			docs: {
				description: {
					component:
						'ClickSplash displays a temporary floating message when triggered. Commonly used for feedback like "+1" or "Copied!" notifications that animate away.'
				}
			}
		},
		argTypes: {
			duration: {
				description: 'Duration in milliseconds before the popover disappears',
				control: 'number',
				defaultValue: 500
			},
			content: {
				description: 'Text content to display in the popover',
				control: 'text'
			},
			size: {
				description: 'Size of the popover text',
				control: 'select',
				options: ['xs', 'sm', 'base', 'lg']
			},
			onTrigger: {
				description: 'Optional callback function triggered on click',
				control: false
			}
		}
	});
</script>

<Story
	name="Default"
	args={{
		duration: 1000,
		content: 'Clicked!',
		size: 'sm'
	}}
>
	{#snippet children(args)}
		<ClickSplash {...args}>
			{#snippet trigger()}
				<Button>Click me!</Button>
			{/snippet}
		</ClickSplash>
	{/snippet}
</Story>

<Story name="TextSizes">
	<div class="flex gap-4">
		<ClickSplash duration={1000} content="Clicked!" size="xs">
			{#snippet trigger()}
				<Button variant="outline" size="sm">Extra Small</Button>
			{/snippet}
		</ClickSplash>

		<ClickSplash duration={1000} content="Clicked!" size="sm">
			{#snippet trigger()}
				<Button variant="outline" size="sm">Small</Button>
			{/snippet}
		</ClickSplash>

		<ClickSplash duration={1000} content="Clicked!" size="base">
			{#snippet trigger()}
				<Button variant="outline" size="default">Base</Button>
			{/snippet}
		</ClickSplash>

		<ClickSplash duration={1000} content="Clicked!" size="lg">
			{#snippet trigger()}
				<Button variant="outline" size="lg">Large</Button>
			{/snippet}
		</ClickSplash>
	</div>
</Story>

<Story name="WithCustomContent">
	<div class="flex gap-4">
		<ClickSplash duration={1000} content="Copied!" size="base">
			{#snippet trigger()}
				<Button variant="outline">Copy text</Button>
			{/snippet}
		</ClickSplash>

		<ClickSplash duration={1000} content="+1" size="base">
			{#snippet trigger()}
				<Button variant="outline">Increment</Button>
			{/snippet}
		</ClickSplash>
	</div>
</Story>
