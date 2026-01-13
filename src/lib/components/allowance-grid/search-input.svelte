<script lang="ts">
	import { X, Search } from '@lucide/svelte';
	import * as InputGroup from '$ui/input-group';
	import { metrics } from '$lib/analytics';

	interface Props {
		searchTerm: string;
	}

	let { searchTerm = $bindable() }: Props = $props();
</script>

<InputGroup.Root class="w-full text-sm font-normal sm:max-w-sm" data-tour-id="search-input">
	<InputGroup.Input
		data-testid="search-input"
		type="text"
		placeholder="Search airlines..."
		bind:value={searchTerm}
		oninput={() => metrics.airlineSearchPerformed(searchTerm)}
	/>
	<InputGroup.Addon>
		<Search class="size-4" />
	</InputGroup.Addon>
	{#if searchTerm}
		<InputGroup.Addon align="inline-end">
			<InputGroup.Button
				data-testid="search-clear-button"
				variant="ghost"
				onclick={() => (searchTerm = '')}
			>
				<X class="size-4" />
				<span class="sr-only">Clear search</span>
			</InputGroup.Button>
		</InputGroup.Addon>
	{/if}
</InputGroup.Root>
