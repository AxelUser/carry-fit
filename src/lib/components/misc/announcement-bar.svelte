<script lang="ts">
	import { X } from '@lucide/svelte';
	import { createLocalStore } from '$lib/storage/local-store.svelte';

	interface Props {
		message: string;
		href?: string;
		storageKey: string;
		dismissible?: boolean;
	}

	let { message, href, storageKey, dismissible }: Props = $props();

	// svelte-ignore state_referenced_locally
	const dismissedStore = createLocalStore<boolean>(storageKey, false);
	const isVisible = $derived(dismissible ? dismissedStore.isLoaded && !dismissedStore.value : true);

	function handleDismiss(e: MouseEvent) {
		e.stopPropagation();
		dismissedStore.value = true;
	}
</script>

{#if isVisible}
	<div class="bg-primary w-full">
		<div
			class="relative mx-auto flex max-w-[1700px] items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5"
		>
			<span
				class="text-primary-foreground flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-90 sm:text-sm"
			>
				{#if href}
					<a {href} target="_blank" rel="noopener noreferrer">
						{message}
					</a>
				{:else}
					<span>{message}</span>
				{/if}
			</span>
			{#if dismissible}
				<button
					onclick={handleDismiss}
					class="hover:bg-primary-foreground/20 absolute right-2 flex items-center justify-center rounded p-1 transition-colors sm:right-4"
					aria-label="Dismiss announcement"
				>
					<X class="text-primary-foreground h-4 w-4" />
				</button>
			{/if}
		</div>
	</div>
{/if}
