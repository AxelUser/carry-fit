<script lang="ts">
	import { Eraser } from '@lucide/svelte';
	import { type MeasurementSystem, type UserDimensions, MeasurementSystems } from '$lib/types';
	import { ShareBagLink, BackpackFill } from '$lib/components/misc';
	import { Label } from '$lib/components/ui/label';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import PasteDimensionsDialog from './paste-dimensions-dialog.svelte';
	import { cn } from '$lib/utils/ui';

	interface Props {
		userDimensions: UserDimensions;
		measurementSystem: MeasurementSystem;
		showFlexibility: boolean;
		fillPercentage: number;
		onChanged: () => void;
	}

	let {
		userDimensions = $bindable(),
		measurementSystem = $bindable(),
		showFlexibility = $bindable(),
		fillPercentage = $bindable(),
		onChanged
	}: Props = $props();

	const unitLabel = $derived(measurementSystem === MeasurementSystems.Metric ? 'cm' : 'in');

	const dimensionPlaceholders = $derived(
		measurementSystem === MeasurementSystems.Metric
			? { height: 'e.g. 55', width: 'e.g. 40', depth: 'e.g. 23' }
			: { height: 'e.g. 22', width: 'e.g. 16', depth: 'e.g. 9' }
	);

	let allDimensionsSet = $derived(
		userDimensions.depth > 0 && userDimensions.width > 0 && userDimensions.height > 0
	);

	// Just to convert commas to dots and remove non-numeric characters.
	function sanitize(raw: string) {
		return raw
			.replace(/,/g, '.')
			.replace(/[^\d.]/g, '')
			.trim();
	}

	// The only reason I do parsing manually, because I don't want HTML5 number inputs.
	function handleDimensionInput(key: keyof UserDimensions, event: Event) {
		const inputEl = event.currentTarget as HTMLInputElement;
		const raw = inputEl.value;
		const cleaned = sanitize(raw);

		// Reject malformed decimals (multiple dots or non-numeric)
		if (!/^\d*(?:\.\d*)?$/.test(cleaned)) {
			inputEl.value = userDimensions[key] > 0 ? `${userDimensions[key]}` : '';
			return;
		}

		// Treat totally cleared input as zero in state
		if (!cleaned) {
			inputEl.value = '';
			userDimensions[key] = 0;
			onChanged();
			return;
		}

		// Normalize leading dot and leading zeros in integer part
		const dotted = cleaned.startsWith('.') ? `0${cleaned}` : cleaned;
		const [intPartRaw, fracPartRaw = ''] = dotted.split('.');
		const intPartTrimmed = intPartRaw.replace(/^0+(?=\d)/, '') || '0';
		const normalized =
			fracPartRaw.length > 0 || dotted.endsWith('.')
				? `${intPartTrimmed}.${fracPartRaw}`
				: intPartTrimmed;

		const parsed = Number.parseFloat(normalized);
		if (!Number.isFinite(parsed) || parsed < 0) {
			inputEl.value = userDimensions[key] > 0 ? `${userDimensions[key]}` : '';
			return;
		}

		inputEl.value = normalized;
		userDimensions[key] = parsed;

		onChanged();
	}

	function resetDimensions() {
		userDimensions.depth = 0;
		userDimensions.width = 0;
		userDimensions.height = 0;
		showFlexibility = false;
		fillPercentage = 100;
	}

	function handlePastedDimensions(dimensions: UserDimensions) {
		userDimensions.height = dimensions.height;
		userDimensions.width = dimensions.width;
		userDimensions.depth = dimensions.depth;

		onChanged();
	}
</script>

{#snippet bagDimensionInput(className: string, key: keyof UserDimensions)}
	<div class={cn('flex flex-col gap-1.5', className)}>
		<Label for={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
		<InputGroup.Root>
			<InputGroup.Input
				type="text"
				id={key}
				value={userDimensions[key] > 0 ? `${userDimensions[key]}` : ''}
				oninput={(e) => handleDimensionInput(key, e)}
				inputmode="decimal"
				autocomplete="off"
				placeholder={dimensionPlaceholders[key]}
				class="pr-12"
			/>
			<InputGroup.Addon align="inline-end">
				{unitLabel}
			</InputGroup.Addon>
		</InputGroup.Root>
	</div>
{/snippet}

<Card.Root>
	<Card.Header>
		<Card.Title>Bag Dimensions</Card.Title>
		<Card.Description>Enter manually or parse from a website</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="mb-3 flex flex-wrap items-center gap-2">
			{#if allDimensionsSet}
				<ShareBagLink {userDimensions} {measurementSystem} />
			{/if}
			<PasteDimensionsDialog {measurementSystem} onDimensionsFound={handlePastedDimensions} />
			<Button variant="ghost" size="sm" onclick={resetDimensions} class="gap-1">
				<Eraser class="size-4" />
				<span>Clear</span>
			</Button>
		</div>

		<div data-tour-id="bag-input" class="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
			{@render bagDimensionInput('order-2 sm:order-1', 'height')}
			{@render bagDimensionInput('order-3 sm:order-2', 'width')}
			{@render bagDimensionInput('order-4 sm:order-3', 'depth')}
			<div class="order-1 col-span-3 flex flex-col gap-1.5 sm:order-4 sm:col-span-1">
				<Label>Units</Label>
				<div
					data-tour-id="measurement-system-select"
					class="bg-card flex w-full items-center gap-2 py-1"
				>
					<Button
						variant={measurementSystem === MeasurementSystems.Metric ? 'default' : 'outline'}
						size="sm"
						class="flex-1 justify-center px-3"
						onclick={() => {
							measurementSystem = MeasurementSystems.Metric;
							onChanged();
						}}
						data-testid="metric-button"
						data-active={measurementSystem === MeasurementSystems.Metric}
					>
						cm/kg
					</Button>
					<Button
						variant={measurementSystem === MeasurementSystems.Imperial ? 'default' : 'outline'}
						size="sm"
						class="flex-1 justify-center px-3"
						onclick={() => {
							measurementSystem = MeasurementSystems.Imperial;
							onChanged();
						}}
						data-testid="imperial-button"
						data-active={measurementSystem === MeasurementSystems.Imperial}
					>
						in/lb
					</Button>
				</div>
			</div>
		</div>

		<p class="text-card-foreground/50 mt-3 mb-3 text-center text-xs font-medium sm:text-sm">
			Don't worry about the order - we'll find the best fit
		</p>

		<div class="mt-4">
			<div class="flex items-center gap-2">
				<Checkbox id="flexibility" bind:checked={showFlexibility} />
				<Label for="flexibility">Soft bag? Get more accurate airline matches</Label>
			</div>

			{#if showFlexibility}
				<div class="mt-3 flex flex-col items-center gap-4 px-2">
					<BackpackFill
						bind:fillPercentage
						onFillPercentageChange={(p) => {
							fillPercentage = p;
						}}
					/>
					<div class="flex max-w-sm flex-col items-center gap-2 text-center">
						<p class="text-primary text-base font-bold">How full is your bag usually?</p>
						<p class="text-muted-foreground text-sm">
							Slide the backpack up or down to have better chances to squeeze in the sizer.
						</p>
					</div>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
