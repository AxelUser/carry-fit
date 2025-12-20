<script lang="ts">
	import { Check, ChevronsUpDown } from '@lucide/svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Search } from '@lucide/svelte';
	import { VirtualList } from 'svelte-virtuallists';
	import { computeMatchScore } from '$lib/utils/matching';
	import { cn } from '$lib/utils/ui';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		items: string[];
		selectedItems: SvelteSet<string>;
		placeholder: string;
		searchPlaceholder?: string;
		allSelectedText: string;
		itemLabel: (item: string) => string;
		getTriggerText: (selectedCount: number, isAllSelected: boolean) => string;
		disabled?: boolean;
	}

	let {
		items = [],
		selectedItems = $bindable(),
		placeholder,
		searchPlaceholder = placeholder,
		itemLabel,
		getTriggerText,
		disabled = false
	}: Props = $props();

	let popoverOpen = $state(false);
	let searchTerm = $state('');

	const isAllSelected = $derived(selectedItems.size === 0);
	const selectedCount = $derived(selectedItems.size);

	const filteredItems = $derived(
		items
			.map((item) => ({
				item,
				score: computeMatchScore(searchTerm.toLowerCase(), itemLabel(item))
			}))
			.filter((entry) => {
				if (!searchTerm) return true;
				return entry.score > 0.5;
			})
			.toSorted((a, b) => {
				return b.score - a.score;
			})
	);

	const triggerText = $derived.by(() => {
		return getTriggerText(selectedCount, isAllSelected);
	});

	function toggleItem(item: string) {
		if (selectedItems.has(item)) {
			selectedItems.delete(item);
		} else {
			selectedItems.add(item);
		}
	}

	function resetToAll() {
		selectedItems.clear();
	}
</script>

<Popover.Root bind:open={popoverOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				role="combobox"
				aria-expanded={popoverOpen}
				class="w-full justify-between"
				{disabled}
			>
				<span class="truncate">{triggerText}</span>
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full p-0" align="start" sideOffset={4} avoidCollisions={false}>
		<div
			class="bg-popover text-popover-foreground w-full rounded-md border shadow-md"
			data-testid="combobox-content"
		>
			<div class="flex items-center border-b px-3 py-1">
				<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
				<Input
					class="placeholder:text-muted-foreground h-9 w-full border-0 bg-transparent py-3 text-sm outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
					bind:value={searchTerm}
					placeholder={searchPlaceholder}
				/>
			</div>

			<ScrollArea class="h-[200px] w-full">
				{#if !isAllSelected}
					<div class="border-b px-2 py-1.5">
						<Button
							variant="ghost"
							size="sm"
							class="h-8 w-full justify-start text-xs"
							onclick={resetToAll}
						>
							Reset to all selected
						</Button>
					</div>
				{/if}

				<div class="relative w-full">
					{#if filteredItems.length > 0}
						<VirtualList class="virtual-list-viewport h-full w-full" items={filteredItems}>
							{#snippet vl_slot({ index, item })}
								{@const isSelected = selectedItems.has(item.item)}
								<button
									class="hover:bg-accent hover:text-accent-foreground relative flex w-full min-w-0 cursor-pointer items-start rounded-sm px-2 py-1.5 text-left text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50"
									role="option"
									aria-selected={isSelected}
									onclick={() => toggleItem(item.item)}
								>
									<div class="flex min-w-0 flex-1 items-center gap-2">
										<Check
											class={cn('h-4 w-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
										/>
										<span class="truncate">{itemLabel(item.item)}</span>
									</div>
								</button>
							{/snippet}
						</VirtualList>
					{:else}
						<div
							class="text-muted-foreground absolute inset-0 flex items-center justify-center text-sm"
						>
							No items found.
						</div>
					{/if}
				</div>
			</ScrollArea>
		</div>
	</Popover.Content>
</Popover.Root>

<style>
	:global(.virtual-list-viewport) {
		scrollbar-width: thin;
		scrollbar-color: hsl(var(--muted-foreground)) transparent;
	}

	:global(.virtual-list-viewport::-webkit-scrollbar) {
		width: 6px;
	}

	:global(.virtual-list-viewport::-webkit-scrollbar-track) {
		background-color: transparent;
	}

	:global(.virtual-list-viewport::-webkit-scrollbar-thumb) {
		background-color: hsl(var(--muted-foreground) / 0.3);
		border-radius: 3px;
	}

	:global(.virtual-list-viewport::-webkit-scrollbar-thumb:hover) {
		background-color: hsl(var(--muted-foreground) / 0.5);
	}
</style>
