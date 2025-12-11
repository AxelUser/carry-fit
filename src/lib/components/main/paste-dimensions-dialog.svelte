<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription
	} from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { DimensionParser } from '$lib/bag-parsing/parser';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { AlertTriangle, ClipboardPaste } from 'lucide-svelte';
	import type { MeasurementSystem, UserDimensions } from '$lib/types';
	import { metrics } from '$lib/analytics';

	let open = $state(false);
	let pastedText = $state('');
	let error = $state('');

	const parser = new DimensionParser();

	interface Props {
		measurementSystem: MeasurementSystem;
		onDimensionsFound: (dimensions: UserDimensions) => void;
	}

	let { measurementSystem, onDimensionsFound }: Props = $props();

	function openDialog() {
		open = true;
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

<Button
	data-tour-id="paste-dimensions"
	variant="ghost"
	size="sm"
	onclick={openDialog}
	class="gap-1"
>
	<ClipboardPaste class="size-4" />
	<span>Parse</span>
</Button>

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
				<AlertTriangle class="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		{/if}

		<div class="flex justify-end gap-2">
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button disabled={pastedText.length === 0} onclick={handlePaste}>Parse Dimensions</Button>
		</div>
	</DialogContent>
</Dialog>
