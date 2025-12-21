<script lang="ts">
	import { RefreshCw, SearchX } from '@lucide/svelte';

	interface Props {
		title: string;
		description: string;
		variant?: 'not-found' | 'refreshing';
	}

	let { title, description, variant = 'not-found' }: Props = $props();
</script>

<div data-testid="empty-state" class="flex flex-col items-center justify-center gap-3 py-12">
	<div class="bg-primary rounded-full">
		<div class="bg-primary/50 rounded-full p-3">
			{#if variant === 'not-found'}
				<SearchX class="text-primary-foreground h-8 w-8" />
			{:else if variant === 'refreshing'}
				<RefreshCw class="text-primary-foreground h-8 w-8 animate-spin" />
			{/if}
		</div>
	</div>

	<p class="text-primary text-xl font-medium sm:text-2xl">{title}</p>
	<p class="text-primary text-center text-base sm:text-lg">
		{description}
	</p>
</div>
