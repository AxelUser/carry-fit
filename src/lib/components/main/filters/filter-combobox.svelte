<script lang="ts">
	import { Check, ChevronsDownUp, ChevronsUpDown, Info, Undo2 } from '@lucide/svelte';
	import * as Popover from '$lib/components/ui/popover';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Search } from '@lucide/svelte';
	import { computeMatchScore } from '$lib/utils/matching';
	import { cn } from '$lib/utils/ui';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { MediaQuery, SvelteSet } from 'svelte/reactivity';
	import * as Empty from '$lib/components/ui/empty';

	interface Props {
		items: string[];
		selectedItems: SvelteSet<string>;
		searchPlaceholder: string;
		itemLabel: (item: string) => string;
		getTriggerText: (selectedCount: number, isAllSelected: boolean) => string;
		disabled?: boolean;
	}

	let {
		items = [],
		selectedItems = $bindable(),
		searchPlaceholder,
		itemLabel,
		getTriggerText,
		disabled = false
	}: Props = $props();

	let opened = $state(false);
	let searchTerm = $state('');

	const isDesktop = new MediaQuery('(min-width: 768px)');

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

	$effect(() => {
		if (!opened) {
			searchTerm = '';
		}
	});
</script>

{#snippet comboboxContent(mobile: boolean)}
	<div class="w-full rounded-md border shadow-md" data-testid="combobox-content">
		<div class="flex items-center border-b px-3 py-1">
			<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
			<Input
				class="placeholder:text-muted-foreground h-9 w-full border-0 bg-transparent py-3 text-sm outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
				bind:value={searchTerm}
				placeholder={searchPlaceholder}
			/>
		</div>

		<ScrollArea class={cn('w-full', mobile ? 'h-[50vh]' : 'h-[250px]')} type="auto">
			<div class="border-b px-2 py-1.5">
				{#if isAllSelected}
					<div class="text-muted-foreground flex h-8 items-center gap-2 text-xs">
						<Info class="h-4 w-4 shrink-0" />
						<span>All selected by default</span>
					</div>
				{:else}
					<Button variant="ghost" size="sm" class="h-8 justify-start text-xs" onclick={resetToAll}>
						<Undo2 class="size-4" />
						Reset to all selected
					</Button>
				{/if}
			</div>

			{#if filteredItems.length > 0}
				{#each filteredItems as item}
					{@const isSelected = selectedItems.has(item.item)}
					<button
						class="hover:bg-accent hover:text-accent-foreground relative flex w-full min-w-0 cursor-pointer items-start rounded-sm px-2 py-1.5 text-left text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50"
						role="option"
						aria-selected={isSelected}
						onclick={() => toggleItem(item.item)}
					>
						<div class="flex min-w-0 flex-1 items-center gap-2">
							<Check class={cn('size-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
							<span class="truncate">{itemLabel(item.item)}</span>
						</div>
					</button>
				{/each}
			{:else}
				<Empty.Root class="h-full border-0 p-4">
					<Empty.Header>
						<Empty.Media variant="icon">
							<Search class="size-5" />
						</Empty.Media>
						<Empty.Title>No items found</Empty.Title>
					</Empty.Header>
				</Empty.Root>
			{/if}
		</ScrollArea>
	</div>
{/snippet}

{#if isDesktop.current}
	<Popover.Root bind:open={opened}>
		<Popover.Trigger>
			{#snippet child({ props }: { props: Record<string, unknown> })}
				<Button
					{...props}
					variant="outline"
					role="combobox"
					aria-expanded={opened}
					class="w-full justify-between"
					{disabled}
				>
					<span class="truncate">{triggerText}</span>
					{#if opened}
						<ChevronsDownUp class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					{:else}
						<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					{/if}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content
			class="w-(--bits-popover-anchor-width) p-0"
			align="start"
			sideOffset={4}
			avoidCollisions={false}
		>
			{@render comboboxContent(false)}
		</Popover.Content>
	</Popover.Root>
{:else}
	<Drawer.Root bind:open={opened}>
		<Drawer.Trigger>
			{#snippet child({ props }: { props: Record<string, unknown> })}
				<Button
					{...props}
					variant="outline"
					role="combobox"
					aria-expanded={opened}
					class="w-full justify-between"
					{disabled}
				>
					<span class="truncate">{triggerText}</span>
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>{triggerText}</Drawer.Title>
			</Drawer.Header>
			<div class="px-4">
				{@render comboboxContent(true)}
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
