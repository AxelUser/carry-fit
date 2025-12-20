<script lang="ts">
	import { X, Search } from '@lucide/svelte';
	import { searchState } from './search.svelte';
	import { Input } from '$lib/components/ui/input';
	import { metrics } from '$lib/analytics';
</script>

<div class="relative w-full text-sm font-normal sm:max-w-sm">
	<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
	<Input
		data-testid="search-input"
		data-tour-id="search-input"
		type="text"
		placeholder="Search airlines..."
		bind:value={searchState.searchTerm}
		class="pl-9 pr-8"
		oninput={() => metrics.airlineSearchPerformed(searchState.searchTerm)}
	/>
	{#if searchState.searchTerm}
		<button
			data-testid="search-clear-button"
			type="button"
			class="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
			onclick={() => searchState.clearSearch()}
		>
			<X class="h-4 w-4" />
			<span class="sr-only">Clear search</span>
		</button>
	{/if}
</div>
