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
	let showSuggestion = $derived(suggestion.shouldShow() || true);
	let suggestionOpen = $state(false);
	const closeSuggestion = () => {
		suggestionOpen = false;
		suggestion.disable();
	};
	let suggestionCta = $state<HTMLButtonElement | null>(null);

	$effect(() => {
		suggestionOpen = showSuggestion;
	});

	function openDialog() {
		open = true;
		closeSuggestion();
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
		class="relative w-64 p-4"
		side="top"
		onOpenAutoFocus={(e) => {
			e.preventDefault();
			suggestionCta?.focus();
		}}
	>
		<div>
			<div class="absolute top-2 right-2">
				<Button variant="ghost" size="icon" class="size-8" onclick={closeSuggestion}>
					<X class="size-4" />
					<span class="sr-only">Close</span>
				</Button>
			</div>
			<div class="space-y-1 pr-6">
				<p class="text-sm font-medium">Copy-pasting?</p>
				<p class="text-muted-foreground text-sm">CarryFit can parse bag dimensions from text.</p>
			</div>
		</div>
		<Button
			bind:ref={suggestionCta}
			variant="default"
			size="sm"
			class="mt-4 w-full"
			onclick={openDialog}>Let's try</Button
		>
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
