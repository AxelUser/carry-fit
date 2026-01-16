<script lang="ts">
	import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '$ui/dialog';
	import { Button } from '$ui/button';
	import { Textarea } from '$ui/textarea';
	import { DimensionParser } from './parser';
	import { Alert, AlertDescription } from '$ui/alert';
	import { TriangleAlert, ClipboardPaste, X } from '@lucide/svelte';
	import type { MeasurementSystem, UserDimensions } from '$lib/types';
	import { metrics } from '$lib/analytics';
	import { ParsingDialogSuggestion } from './parsing-dialog-suggestion.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { watch } from 'runed';

	let open = $state(false);
	let pastedText = $state('');
	let error = $state('');

	const parser = new DimensionParser();

	interface Props {
		measurementSystem: MeasurementSystem;
		onDimensionsFound: (dimensions: UserDimensions) => void;
		userDimensions: UserDimensions;
	}

	let { measurementSystem, onDimensionsFound, userDimensions }: Props = $props();

	const suggestion = new ParsingDialogSuggestion(() => userDimensions);
	let showSuggestion = $derived(suggestion.shouldShow());
	let suggestionOpen = $state(false);
	const closeAndDisableSuggestion = () => {
		suggestionOpen = false;
		suggestion.disable();
	};

	watch(
		() => showSuggestion,
		(shouldShow) => {
			suggestionOpen = shouldShow;
		}
	);

	$effect(() => {
		suggestionOpen = showSuggestion;
	});

	function openDialog() {
		open = true;
		closeAndDisableSuggestion();
		metrics.dimensionParsingOpened();
	}

	function handlePaste() {
		error = '';
		const result = parser.parse(pastedText, measurementSystem);

		metrics.dimensionParsingUsed(!!result, pastedText);

		if (!result) {
			error = 'No dimensions found. Try pasting only the line with bag measurements.';
			return;
		}

		onDimensionsFound(result);
		open = false;
	}

	$effect(() => {
		if (!open) {
			pastedText = '';
			error = '';
		}
	});

	function handleValueChange() {
		if (error) {
			error = '';
		}
	}
</script>

<Popover.Root bind:open={suggestionOpen}>
	<Popover.Trigger>
		{#snippet child({ props }: { props: Record<string, unknown> })}
			<Button
				{...props}
				data-tour-id="paste-dimensions"
				variant="ghost"
				size="sm"
				onclick={openDialog}
				class="relative gap-1"
			>
				<ClipboardPaste class="size-4" />
				<span>Parse</span>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		trapFocus={false}
		onOpenAutoFocus={(e) => e.preventDefault()}
		onEscapeKeydown={closeAndDisableSuggestion}
		class="relative w-64 p-4"
		side="top"
	>
		<Button
			variant="ghost"
			size="icon"
			class="absolute top-1 right-1 size-8"
			onclick={closeAndDisableSuggestion}
		>
			<X class="size-4" />
			<span class="sr-only">Close</span>
		</Button>
		<div class="space-y-1">
			<p class="text-sm font-medium">Copy-pasting?</p>
			<p class="text-muted-foreground text-sm">
				Did you know that CarryFit can parse bag dimensions from text?
			</p>
		</div>
		<Button variant="default" size="sm" class="mt-4 w-full" onclick={openDialog}>Let's try</Button>
	</Popover.Content>
</Popover.Root>

<Dialog bind:open>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Paste Bag Dimensions</DialogTitle>
			<DialogDescription>
				Copy and paste text containing bag dimensions from any product page or description.
			</DialogDescription>
		</DialogHeader>

		<Textarea
			placeholder="e.g. 45 x 35 x 20 cm"
			bind:value={pastedText}
			oninput={handleValueChange}
			rows={4}
			class="max-h-60"
		/>

		{#if error}
			<Alert variant="destructive">
				<TriangleAlert class="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		{/if}

		<div class="flex justify-end gap-2">
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button disabled={pastedText.length === 0} onclick={handlePaste}>Parse Dimensions</Button>
		</div>
	</DialogContent>
</Dialog>
