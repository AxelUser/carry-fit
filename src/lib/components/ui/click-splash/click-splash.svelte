<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { cn } from '$lib/utils/styling';
	import type { Snippet } from 'svelte';

	interface Props {
		duration?: number;
		content?: string;
		size?: 'xs' | 'sm' | 'base' | 'lg';
		onTrigger?: () => Promise<void> | void;
		trigger: Snippet;
	}

	let { duration = 500, onTrigger, content, size = 'xs', trigger }: Props = $props();
	let isOpen = $state(false);
	let clickCount = $state(0);

	const sizeClasses = {
		xs: 'text-xs',
		sm: 'text-sm',
		base: 'text-base',
		lg: 'text-lg'
	};

	async function handleTriggerClick() {
		if (isOpen) return;

		try {
			isOpen = true;
			clickCount++; // Increment to force animation restart
			if (onTrigger) {
				await onTrigger();
			}
		} finally {
			setTimeout(() => {
				isOpen = false;
			}, duration);
		}
	}
</script>

<div role="none" class="relative inline-flex items-start" onclick={handleTriggerClick}>
	{@render trigger()}

	{#key clickCount}
		{#if isOpen}
			<div
				class="pointer-events-none absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"
				transition:fly={{ duration, easing: cubicOut }}
			>
				<span class={cn('animate-float-away block font-medium text-gray-700', sizeClasses[size])}>
					{content}
				</span>
			</div>
		{/if}
	{/key}
</div>

<style>
	@keyframes floatAway {
		0% {
			opacity: 0;
			transform: translate(0%, 0%) rotate(0deg);
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translate(0%, -200%) rotate(30deg);
		}
	}

	.animate-float-away {
		animation: floatAway 1s ease-out forwards;
	}
</style>
