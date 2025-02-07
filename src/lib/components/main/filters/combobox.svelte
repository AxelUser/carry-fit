<script lang="ts">
	import { VirtualList } from 'svelte-virtuallists';
	import { ChevronsUpDown, Check } from 'lucide-svelte';
	import { clickOutside } from '$lib/actions/click-outside';
	import { cn } from '$lib/utils/styling';
	import { computeMatchScore } from '$lib/utils/matching';
	import { Input } from '$lib/components/ui/input';
	import type { Snippet } from 'svelte';
	import type { AirlineInfo } from '$lib/types';

	interface Props {
		items: AirlineInfo[];
		onSelect: (item: AirlineInfo) => void;
		placeholder: string;
		maxHeight: number;
		class?: string;
		element: Snippet<[{ item: AirlineInfo }]>;
	}

	let {
		items = [],
		onSelect,
		placeholder = 'Select items...',
		maxHeight = 300,
		element
	}: Props = $props();

	let searchTerm = $state('');

	const filteredItems = $derived(
		items
			.map((item) => ({
				airline: item,
				score: computeMatchScore(searchTerm.toLowerCase(), item.airline)
			}))
			.filter((item) => {
				if (!searchTerm) return true;
				return item.score > 0.5;
			})
			.toSorted((a, b) => {
				return b.score - a.score;
			})
	);
</script>

<div
	class="absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
	data-testid="combobox-content"
>
	<div class="flex items-center border-b px-3">
		<Input bind:value={searchTerm} placeholder="Search..." />
	</div>

	<div style="height: {maxHeight}px;">
		<VirtualList items={filteredItems}>
			{#snippet vl_slot({ index, item })}
				{@render element({ item: item.airline })}
			{/snippet}
		</VirtualList>
	</div>

	{#if filteredItems.length === 0}
		<div class="py-6 text-center text-sm text-muted-foreground">No results found.</div>
	{/if}
</div>
