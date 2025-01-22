<script lang="ts">
	import { cn } from '$lib/utils/styling';
	import { tv, type VariantProps } from 'tailwind-variants';
	import type { Snippet } from 'svelte';

	const card = tv({
		base: 'rounded-xl shadow-md',
		variants: {
			variant: {
				default: 'bg-white/95 ring-1 ring-sky-100',
				warning: 'bg-amber-50/90 ring-1 ring-amber-200'
			},
			collapsible: {
				true: 'overflow-hidden group',
				false: ''
			},
			borderAccent: {
				true: 'border-l-4',
				false: ''
			}
		},
		compoundVariants: [
			{
				variant: 'warning',
				borderAccent: true,
				class: 'border-l-amber-400'
			}
		],
		defaultVariants: {
			variant: 'default',
			collapsible: false,
			borderAccent: false
		}
	});

	interface Props {
		class?: string;
		variant?: 'default' | 'warning';
		collapsible?: boolean;
		borderAccent?: boolean;
		title?: string;
		children?: Snippet;
	}

	let {
		class: className,
		variant = 'default',
		collapsible = false,
		borderAccent = variant === 'warning',
		title,
		children
	}: Props = $props();

	const summaryStyles = {
		default: 'text-sky-900 hover:bg-sky-50',
		warning: 'text-amber-700 hover:bg-amber-100/90'
	};

	const contentStyles = {
		default: 'border-t border-sky-100 p-6 pt-4',
		warning: 'border-t border-amber-200 p-5 pt-3'
	};
</script>

{#if collapsible}
	<details class={cn(card({ variant, collapsible, borderAccent }), className)}>
		<summary class={cn('cursor-pointer p-4 font-medium', summaryStyles[variant])}>
			{title}
		</summary>
		<div class={cn('border-t', contentStyles[variant])}>
			{@render children?.()}
		</div>
	</details>
{:else}
	<div class={cn('p-6', card({ variant, collapsible, borderAccent }), className)}>
		{@render children?.()}
	</div>
{/if}
