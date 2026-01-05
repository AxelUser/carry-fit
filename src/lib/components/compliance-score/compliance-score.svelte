<script lang="ts">
	import { onMount } from 'svelte';
	import { DEFAULT_PERSONAL_ITEM } from '$lib/allowances';
	import { type FillSuggestion } from '$lib/bag-scoring';
	import { getScoreVisual } from './scoring-messages';
	import { cn } from '$lib/utils/ui';
	import * as Dialog from '$ui/dialog';
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
	import { type UserDimensions, type MeasurementSystem, MeasurementSystems } from '$lib/types';
	import { descDimensions, formatDims } from '$lib/utils/dimensions';
	import { BackgroundRenderer } from './background-renderer.svelte';

	interface Props {
		carryOnScore: number;
		personalItemScore: number;
		showBackground?: boolean;
		airlinesCount: number;
		userDimensions: UserDimensions;
		measurementSystem: MeasurementSystem;
		suggestion?: FillSuggestion | null;
		onApplySuggestion?: (fillPercentage: number) => void;
	}

	let {
		carryOnScore,
		personalItemScore,
		showBackground = true,
		airlinesCount,
		userDimensions,
		measurementSystem,
		suggestion,
		onApplySuggestion
	}: Props = $props();

	const visual = $derived(getScoreVisual(carryOnScore, personalItemScore));
	const message = $derived(visual.message);
	const backgroundImage = $derived(visual.image);
	let reduceMotion = $state(false);

	const shouldAnimateBackground = $derived(showBackground && !reduceMotion);
	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let img = $state<HTMLImageElement | null>(null);
	const imagePromises = new Map<string, Promise<HTMLImageElement>>();
	let currentImageSrc = $state<string | null>(null);
	const renderer = new BackgroundRenderer(
		() => canvasEl,
		() => img
	);

	function loadImage(src: string) {
		if (imagePromises.has(src)) {
			return imagePromises.get(src)!;
		}

		const promise = new Promise<HTMLImageElement>((resolve, reject) => {
			const image = new Image();
			image.src = src;
			image.onload = () => {
				resolve(image);
			};
			image.onerror = reject;
		});

		imagePromises.set(src, promise);
		return promise;
	}

	async function ensureImage(src: string) {
		if (currentImageSrc === src && img) return;

		currentImageSrc = src;
		const loaded = await loadImage(src).catch(() => null);
		if (!loaded) return;
		// Only swap if the desired image is still current
		if (currentImageSrc === src) {
			img = loaded;
		}
	}

	onMount(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = media.matches;
		const handler = (event: MediaQueryListEvent) => {
			reduceMotion = event.matches;
		};
		media.addEventListener('change', handler);

		return () => {
			media.removeEventListener('change', handler);
			renderer.stop();
		};
	});

	$effect(() => {
		if (!shouldAnimateBackground || !img) {
			renderer.stop();
			return;
		}

		renderer.start();
		return () => {
			renderer.stop();
		};
	});

	$effect(() => {
		if (!shouldAnimateBackground) return;

		ensureImage(backgroundImage).catch(() => {});
	});

	function getScoreClasses(score: number) {
		if (score < 60) {
			return {
				text: 'text-red-600',
				bar: 'bg-red-500',
				barBg: 'bg-red-500/20'
			};
		}
		if (score <= 80) {
			return {
				text: 'text-amber-600',
				bar: 'bg-amber-500',
				barBg: 'bg-amber-500/20'
			};
		}
		return {
			text: 'text-emerald-600',
			bar: 'bg-emerald-500',
			barBg: 'bg-emerald-500/20'
		};
	}

	const carryOnClasses = $derived(getScoreClasses(carryOnScore));
	const personalItemClasses = $derived(getScoreClasses(personalItemScore));

	const bagDimensionsDisplay = $derived(
		formatDims(
			descDimensions([userDimensions.height, userDimensions.width, userDimensions.depth]),
			measurementSystem
		)
	);
	const defaultPersonalItemDisplay = $derived(
		measurementSystem === MeasurementSystems.Metric
			? formatDims(DEFAULT_PERSONAL_ITEM.centimeters, measurementSystem)
			: formatDims(DEFAULT_PERSONAL_ITEM.inches, measurementSystem)
	);
</script>

<Card.Root class="relative overflow-hidden text-center" data-testid="compliance-score">
	<Card.Content>
		{#if shouldAnimateBackground}
			<canvas
				class="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-25"
				bind:this={canvasEl}
			></canvas>
		{/if}

		<div class="relative z-20 mx-auto max-w-4xl space-y-8">
			<div class="text-foreground text-2xl leading-tight font-extrabold drop-shadow-lg sm:text-3xl">
				{message}
			</div>

			<div class="grid grid-cols-2 gap-4">
				{@render complianceScoreResults('Carry-on', 'carry-on', carryOnScore, carryOnClasses)}

				{@render complianceScoreResults(
					'Personal Item',
					'personal-item',
					personalItemScore,
					personalItemClasses
				)}
			</div>

			<div class="text-center">
				<Dialog.Root>
					<Dialog.Trigger class="text-muted-foreground hover:text-foreground text-sm underline"
						>But why?</Dialog.Trigger
					>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>How Scoring Works</Dialog.Title>
						</Dialog.Header>
						<Dialog.Description>
							<div class="space-y-4">
								<p>
									Your bag size <strong>({bagDimensionsDisplay})</strong> was compared to
									<strong>{airlinesCount}</strong>
									{airlinesCount === 1 ? "airline's" : "airlines'"}
									{airlinesCount === 1 ? 'rule' : 'rules'} that match your filters, for both carry-on
									and personal item.
								</p>
								<p>The score is basically the percentage of airlines that allow your bag.</p>
								<p>
									You might wonder why the personal item score is low, even though more airlines
									might accept your bag. Since airlines often do not give exact size limits for
									personal items and just say it must fit under the seat, we use a standard size of <strong
										>{defaultPersonalItemDisplay}</strong
									>. This size is small, but it is a safe guess.
								</p>
							</div>
						</Dialog.Description>
					</Dialog.Content>
				</Dialog.Root>
			</div>

			{#if suggestion}
				<div class="border-primary/40 bg-primary/10 mt-4 rounded-lg border p-3">
					<p class="text-foreground mb-2 text-sm">
						Got a soft bag that compacts? Packing it to <strong>{suggestion.fillPercentage}%</strong
						>
						could boost your score to <strong>{suggestion.complianceScore.toFixed(0)}%</strong>!
					</p>
					{#if onApplySuggestion}
						<Button onclick={() => onApplySuggestion(suggestion.fillPercentage)} variant="link">
							Apply Suggestion
						</Button>
					{/if}
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>

{#snippet complianceScoreResults(
	label: string,
	sectionKey: string,
	percentage: number,
	classes: { text: string; bar: string; barBg: string }
)}
	<div
		class="flex flex-col items-center"
		data-testid="compliance-score-section"
		data-section={sectionKey}
	>
		<div class="text-md text-foreground mb-2 font-semibold drop-shadow-xs">{label}</div>
		<div class={cn('relative mb-2 h-3 w-full overflow-hidden rounded-full', classes.barBg)}>
			<div
				class={cn('h-full transition-all duration-500 ease-out', classes.bar)}
				style="width: {percentage}%"
				data-testid="compliance-score-bar"
			></div>
		</div>
		<div
			class={cn('text-2xl font-black tracking-tight drop-shadow-xs sm:text-3xl', classes.text)}
			data-testid="compliance-score-percentage"
		>
			{percentage.toFixed(0)}%
		</div>
	</div>
{/snippet}
