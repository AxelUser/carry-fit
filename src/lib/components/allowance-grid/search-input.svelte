<script lang="ts">
	import { X, Search } from '@lucide/svelte';
	import { searchState } from './search.svelte';
	import * as InputGroup from '$ui/input-group';
	import { metrics } from '$lib/analytics';
</script>

<InputGroup.Root class="w-full text-sm font-normal sm:max-w-sm" data-tour-id="search-input">
	<InputGroup.Input
		data-testid="search-input"
		type="text"
		placeholder="Search airlines..."
		bind:value={searchState.searchTerm}
		oninput={() => metrics.airlineSearchPerformed(searchState.searchTerm)}
	/>
	<InputGroup.Addon>
		<Search class="size-4" />
	</InputGroup.Addon>
	{#if searchState.searchTerm}
		<InputGroup.Addon align="inline-end">
			<InputGroup.Button
				data-testid="search-clear-button"
				variant="ghost"
				onclick={() => searchState.clearSearch()}
			>
				<X class="size-4" />
				<span class="sr-only">Clear search</span>
			</InputGroup.Button>
		</InputGroup.Addon>
	{/if}
</InputGroup.Root>
