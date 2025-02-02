<script lang="ts">
	import { RefreshCw, SearchX } from 'lucide-svelte';

	interface Props {
		title: string;
		description: string;
		variant?: 'not-found' | 'refreshing';
	}

	let { title, description, variant = 'not-found' }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center gap-3 py-12">
	<div class="rounded-full bg-primary">
		<div class="rounded-full bg-primary/50 p-3">
			{#if variant === 'not-found'}
				<SearchX class="h-8 w-8 text-primary-foreground" />
			{:else if variant === 'refreshing'}
				<RefreshCw class="h-8 w-8 animate-spin text-primary-foreground" />
			{/if}
		</div>
	</div>

	<p class="text-xl font-medium text-primary sm:text-2xl">{title}</p>
	<p class="text-center text-base text-primary sm:text-lg">
		{description}
	</p>
</div>
