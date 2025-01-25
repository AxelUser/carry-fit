<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/components/ui/button';
	import { Check } from 'lucide-svelte';

	const { Story } = defineMeta({
		title: 'UI/Button',
		component: Button,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered',
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

<Story name="Old vs New Selected Region Filter Button" args={{ variant: 'gradient', pill: true }}>
	{#snippet children(args)}
		<div class="grid grid-cols-2 justify-items-start gap-4">
			<div class="text-sm font-medium">Old Button</div>
			<button
				class="flex items-center rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all duration-200 hover:from-sky-700 hover:to-blue-800 sm:px-4 sm:py-2 sm:text-sm"
			>
				<span>North America</span>
				<div class="ml-2">
					<Check class="h-3 w-3 sm:h-4 sm:w-4" />
				</div>
			</button>
			<div class="text-sm font-medium">New Button</div>
			<Button {...args}>
				<span>North America</span>
				<div class="ml-2">
					<Check class="h-3 w-3 sm:h-4 sm:w-4" />
				</div>
			</Button>
		</div>
	{/snippet}
</Story>

<Story name="Old vs New Unselected Region Filter Button" args={{ variant: 'outline', pill: true }}>
	{#snippet children(args)}
		<div class="grid grid-cols-2 justify-items-start gap-4">
			<div class="text-sm font-medium">Old Button</div>
			<button
				class="flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-medium text-sky-700 ring-1 ring-sky-200 transition-all duration-200 hover:bg-sky-50 sm:px-4 sm:py-2 sm:text-sm"
			>
				<span>North America</span>
			</button>
			<div class="text-sm font-medium">New Button</div>
			<Button {...args}>
				<span>North America</span>
			</Button>
		</div>
	{/snippet}
</Story>

<Story name="Old vs New Disabled Region Filter Button" args={{ variant: 'disabled', pill: true }}>
	{#snippet children(args)}
		<div class="grid grid-cols-2 justify-items-start gap-4">
			<div class="text-sm font-medium">Old Button</div>
			<button
				class="flex cursor-not-allowed items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400 ring-1 ring-gray-200 transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm"
			>
				<span>North America</span>
			</button>
			<div class="text-sm font-medium">New Button</div>
			<Button {...args}>
				<span>North America</span>
			</Button>
		</div>
	{/snippet}
</Story>
