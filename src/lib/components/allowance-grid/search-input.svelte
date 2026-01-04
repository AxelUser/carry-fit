<script lang="ts">
	import { X, Search } from '@lucide/svelte';
	import { searchState } from './search.svelte';
	import { Input } from '$ui/input';
	import { metrics } from '$lib/analytics';
</script>

<div class="relative w-full text-sm font-normal sm:max-w-sm">
	<Search class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
	<Input
		data-testid="search-input"
		data-tour-id="search-input"
		type="text"
		placeholder="Search airlines..."
		bind:value={searchState.searchTerm}
		class="pr-8 pl-9"
		oninput={() => metrics.airlineSearchPerformed(searchState.searchTerm)}
	/>
	{#if searchState.searchTerm}
		<button
			data-testid="search-clear-button"
			type="button"
			class="ring-offset-background focus:ring-ring absolute top-1/2 right-2 -translate-y-1/2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
			onclick={() => searchState.clearSearch()}
		>
			<X class="h-4 w-4" />
			<span class="sr-only">Clear search</span>
		</button>
	{/if}
</div>
