<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/components/ui/button';
	import { Check } from '@lucide/svelte';

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
				options: ['default', 'secondary', 'outline', 'ghost']
			},
			size: {
				description: 'The size of the button',
				control: 'select',
				options: ['sm', 'md', 'lg']
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

<Story name="Default" args={{ variant: 'default', size: 'default' }}>
	{#snippet children(args)}
		<Button {...args}>Default</Button>
	{/snippet}
</Story>
<Story name="Secondary" args={{ variant: 'secondary', size: 'default' }}>
	{#snippet children(args)}
		<Button {...args}>Secondary</Button>
	{/snippet}
</Story>
<Story name="Outline" args={{ variant: 'outline', size: 'default' }}>
	{#snippet children(args)}
		<Button {...args}>Outline</Button>
	{/snippet}
</Story>
<Story name="Ghost" args={{ variant: 'ghost', size: 'default' }}>
	{#snippet children(args)}
		<Button {...args}>Ghost</Button>
	{/snippet}
</Story>
<Story name="Disabled" args={{ disabled: true, size: 'default' }}>
	{#snippet children(args)}
		<Button {...args}>Disabled</Button>
	{/snippet}
</Story>
<Story name="Small" args={{ size: 'sm' }}>
	{#snippet children(args)}
		<Button {...args}>Small</Button>
	{/snippet}
</Story>
<Story name="Medium" args={{ size: 'default' }}>
	{#snippet children(args)}
		<Button {...args}>Medium</Button>
	{/snippet}
</Story>
<Story name="Large" args={{ size: 'lg' }}>
	{#snippet children(args)}
		<Button {...args}>Large</Button>
	{/snippet}
</Story>
<Story name="Region filter button" args={{ variant: 'default' }}>
	{#snippet children(args)}
		<Button {...args}>
			<span>North America</span>
			<Check class="ml-2 h-4 w-4" />
		</Button>
	{/snippet}
</Story>

<Story name="Old vs New Selected Region Filter Button" args={{ variant: 'default' }}>
	{#snippet children(args)}
		<div class="grid grid-cols-2 justify-items-start gap-4">
			<div class="text-sm font-medium">Old Button</div>
			<button
				class="flex items-center rounded-full bg-linear-to-r from-sky-600 to-blue-700 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all duration-200 hover:from-sky-700 hover:to-blue-800 sm:px-4 sm:py-2 sm:text-sm"
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

<Story name="Old vs New Unselected Region Filter Button" args={{ variant: 'outline' }}>
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

<Story name="Old vs New Disabled Region Filter Button" args={{ disabled: true }}>
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
