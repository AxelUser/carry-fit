<script lang="ts">
	import { X } from 'lucide-svelte';
	import { searchState } from './search.svelte';
	import { Input } from '$lib/components/ui/input';
</script>

<div class="relative max-w-60 text-sm font-normal">
	<Input
		data-testid="search-input"
		data-tour-id="search-input"
		type="text"
		placeholder="Search airlines..."
		bind:value={searchState.searchTerm}
		class="pr-8"
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
