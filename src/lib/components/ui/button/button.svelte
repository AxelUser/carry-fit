<script lang="ts">
	import { cn } from '$lib/utils/styling';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { tv, type VariantProps } from 'tailwind-variants';

	const buttonVariants = tv({
		base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
		variants: {
			variant: {
				primary: 'bg-sky-100 text-sky-700 hover:bg-sky-200',
				secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
				gradient:
					'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md hover:from-sky-700 hover:to-blue-800',
				outline: 'bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50',
				ghost: 'bg-transparent hover:bg-sky-50',
				disabled: 'cursor-not-allowed bg-gray-100 text-gray-400 ring-1 ring-gray-200'
			},
			size: {
				sm: 'px-2 py-1.5 text-xs',
				md: 'px-3 py-1.5 text-xs sm:py-2 sm:text-sm',
				lg: 'px-4 py-2 text-base'
			},
			pill: {
				true: 'rounded-full',
				false: 'rounded-lg'
			},
			fullWidth: {
				true: 'w-full',
				false: ''
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
			pill: false,
			fullWidth: false
		}
	});

	type ButtonVariants = VariantProps<typeof buttonVariants>;

	type Props = ButtonVariants & HTMLButtonAttributes;

	let {
		class: className = '',
		variant,
		size,
		pill,
		fullWidth,
		disabled = false,
		type = 'button',
		children,
		...otherProps
	}: Props = $props();

	$effect(() => {
		if (disabled) {
			variant = 'disabled';
		}
	});
</script>

<button
	{type}
	class={cn(buttonVariants({ variant, size, pill, fullWidth }), className)}
	{disabled}
	{...otherProps}
>
	{#if children}
		{@render children()}
	{/if}
</button>
