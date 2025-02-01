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
	import { AlertTriangle } from 'lucide-svelte';
	import type { MeasurementSystem } from '$lib/types';

	let open = $state(false);
	let pastedText = $state('');
	let error = $state('');

	const parser = new DimensionParser();

	interface Props {
		measurementSystem: MeasurementSystem;
		onDimensionsFound: (dimensions: { height: number; width: number; depth: number }) => void;
	}

	let { measurementSystem, onDimensionsFound }: Props = $props();

	function handlePaste() {
		error = '';
		const result = parser.parse(pastedText, measurementSystem);

		if (!result) {
			error =
				'Could not find dimensions in the pasted text. Please try copying more text from the product page.';
			return;
		}

		onDimensionsFound(result);
		open = false;
		pastedText = '';
	}
</script>

<Button variant="outline" onclick={() => (open = true)}>Paste from Website</Button>

<Dialog bind:open>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Paste Bag Dimensions</DialogTitle>
			<DialogDescription>
				Copy and paste text containing bag dimensions from any product page or description.
			</DialogDescription>
		</DialogHeader>

		<Textarea placeholder="Paste product description here..." bind:value={pastedText} rows={6} />

		{#if error}
			<Alert variant="destructive">
				<AlertTriangle class="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		{/if}

		<div class="flex justify-end gap-2">
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button onclick={handlePaste}>Parse Dimensions</Button>
		</div>
	</DialogContent>
</Dialog>
