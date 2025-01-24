<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Check } from 'lucide-svelte';

	const { Story } = defineMeta({
		title: 'UI/Button',
		component: Button,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'A flexible button component that supports various styles, sizes, and states. Can be customized with different variants, sizes, and additional classes.'
				}
			}
		},
		argTypes: {
			variant: {
				description: 'The visual style variant of the button',
				control: 'select',
				options: ['primary', 'secondary', 'gradient', 'outline', 'ghost', 'disabled']
			},
			size: {
				description: 'The size of the button',
				control: 'select',
				options: ['sm', 'md', 'lg']
			},
			pill: {
				description: 'Whether the button should have fully rounded corners',
				control: 'boolean'
			},
			fullWidth: {
				description: 'Whether the button should take up the full width of its container',
				control: 'boolean'
			},
			disabled: {
				description: 'Whether the button is disabled',
				control: 'boolean'
			},
			type: {
				description: 'The HTML button type attribute',
				control: 'select',
				options: ['button', 'submit', 'reset']
			}
		}
	});
</script>

<Story name="Primary" args={{ variant: 'primary', size: 'md' }}>
	{#snippet children(args)}
		<Button {...args}>Primary</Button>
	{/snippet}
</Story>
<Story name="Secondary" args={{ variant: 'secondary', size: 'md' }}>
	{#snippet children(args)}
		<Button {...args}>Secondary</Button>
	{/snippet}
</Story>
<Story name="Gradient" args={{ variant: 'gradient', size: 'md' }}>
	{#snippet children(args)}
		<Button {...args}>Gradient</Button>
	{/snippet}
</Story>
<Story name="Outline" args={{ variant: 'outline', size: 'md' }}>
	{#snippet children(args)}
		<Button {...args}>Outline</Button>
	{/snippet}
</Story>
<Story name="Ghost" args={{ variant: 'ghost', size: 'md' }}>
	{#snippet children(args)}
		<Button {...args}>Ghost</Button>
	{/snippet}
</Story>
<Story name="Disabled" args={{ variant: 'disabled', size: 'md' }}>
	{#snippet children(args)}
		<Button {...args}>Disabled</Button>
	{/snippet}
</Story>
<Story name="Small" args={{ variant: 'primary', size: 'sm' }}>
	{#snippet children(args)}
		<Button {...args}>Small</Button>
	{/snippet}
</Story>
<Story name="Medium" args={{ variant: 'primary', size: 'md' }}>
	{#snippet children(args)}
		<Button {...args}>Medium</Button>
	{/snippet}
</Story>
<Story name="Large" args={{ variant: 'primary', size: 'lg' }}>
	{#snippet children(args)}
		<Button {...args}>Large</Button>
	{/snippet}
</Story>
<Story name="Pill" args={{ variant: 'primary', pill: true }}>
	{#snippet children(args)}
		<Button {...args}>Pill-like style</Button>
	{/snippet}
</Story>
<Story name="Region filter button" args={{ variant: 'gradient', pill: true }}>
	{#snippet children(args)}
		<Button {...args}>
			<span>North America</span>
			<Check class="ml-2 h-4 w-4" />
		</Button>
	{/snippet}
</Story>
<Story name="Full Width" args={{ variant: 'primary', fullWidth: true }}>
	{#snippet children(args)}
		<Button {...args}>Full Width</Button>
	{/snippet}
</Story>
