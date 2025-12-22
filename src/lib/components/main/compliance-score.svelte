<script lang="ts">
	import { onMount } from 'svelte';
	import { getScoreVisual, DEFAULT_PERSONAL_ITEM, type FillSuggestion } from '$lib/allowances';
	import { cn } from '$lib/utils/ui';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { type UserDimensions, type MeasurementSystem, MeasurementSystems } from '$lib/types';
	import { descDimensions, formatDims } from '$lib/utils/dimensions';

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
	const emojiSize = 56;
	const tileStep = 88; // emoji size + gap
	const columnRise = tileStep * 0.35;
	const speed = 24; // px per second
	let img: HTMLImageElement | null = null;
	const imagePromises = new Map<string, Promise<HTMLImageElement>>();
	let currentImageSrc = $state<string | null>(null);
	let rafId: number | null = null;
	let lastTs = 0;
	let offsetX = 0;
	let offsetY = 0;

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

	function getCanvasRect() {
		if (!canvasEl) return null;
		const rect = canvasEl.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) {
			return canvasEl.parentElement?.getBoundingClientRect() ?? null;
		}
		return rect;
	}

	function resizeCanvas() {
		if (!canvasEl) return;
		const dpr = window.devicePixelRatio || 1;
		const rect = getCanvasRect();
		if (!rect) return;
		const { width, height } = rect;
		canvasEl.width = width * dpr;
		canvasEl.height = height * dpr;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	function stopLoop() {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	}

	function loop(ts: number) {
		if (!canvasEl || !img) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const delta = lastTs ? (ts - lastTs) / 1000 : 0;
		lastTs = ts;

		offsetX = offsetX + speed * delta;
		offsetY = offsetY - speed * delta;

		const { width, height } = canvasEl.getBoundingClientRect();
		ctx.clearRect(0, 0, width, height);

		ctx.save();
		ctx.globalAlpha = 0.6;

		const startColumn = Math.floor((-tileStep - offsetX) / tileStep);
		const endColumn = Math.floor((width + tileStep - offsetX) / tileStep);

		for (let column = startColumn; column <= endColumn; column++) {
			const x = column * tileStep + offsetX;
			const startRow = Math.floor((-tileStep - offsetY + column * columnRise) / tileStep);
			for (
				let y = startRow * tileStep + offsetY - column * columnRise;
				y < height + tileStep;
				y += tileStep
			) {
				ctx.drawImage(img, x, y, emojiSize, emojiSize);
			}
		}

		ctx.restore();

		rafId = requestAnimationFrame(loop);
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

	async function startLoopIfNeeded() {
		if (rafId !== null) return;
		lastTs = 0;
		resizeCanvas();
		rafId = requestAnimationFrame(loop);
	}

	onMount(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = media.matches;
		const handler = (event: MediaQueryListEvent) => {
			reduceMotion = event.matches;
		};
		media.addEventListener('change', handler);
		const resize = () => resizeCanvas();
		window.addEventListener('resize', resize);

		if (shouldAnimateBackground) {
			startLoopIfNeeded().catch(() => {});
		}

		return () => {
			media.removeEventListener('change', handler);
			window.removeEventListener('resize', resize);
			stopLoop();
		};
	});

	$effect(() => {
		if (!canvasEl || !shouldAnimateBackground) {
			stopLoop();
			return;
		}

		ensureImage(backgroundImage).then(() => {
			if (!shouldAnimateBackground) return;
			startLoopIfNeeded().catch(() => {});
		});

		return () => stopLoop();
	});

	function getScoreClasses(score: number) {
		if (score < 60) {
			return {
				text: 'text-red-600',
				bar: 'bg-red-500'
			};
		}
		if (score <= 80) {
			return {
				text: 'text-amber-600',
				bar: 'bg-amber-500'
			};
		}
		return {
			text: 'text-emerald-600',
			bar: 'bg-emerald-500'
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

<div
	class="border-border bg-card relative overflow-hidden rounded-xl border-2 p-6 text-center shadow-xs"
	data-testid="compliance-score"
>
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
								{airlinesCount === 1 ? 'rule' : 'rules'} that match your filters, for both carry-on and
								personal item.
							</p>
							<p>The score is basically the percentage of airlines that allow your bag.</p>
							<p>
								You might wonder why the personal item score is low, even though more airlines might
								accept your bag. Since airlines often do not give exact size limits for personal
								items and just say it must fit under the seat, we use a standard size of <strong
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
					Got a soft bag that compacts? Packing it to <strong>{suggestion.fillPercentage}%</strong>
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
</div>

{#snippet complianceScoreResults(
	label: string,
	sectionKey: string,
	percentage: number,
	classes: { text: string; bar: string }
)}
	<div
		class="flex flex-col items-center"
		data-testid="compliance-score-section"
		data-section={sectionKey}
	>
		<div class="text-md text-foreground mb-2 font-semibold drop-shadow-xs">{label}</div>
		<div class="bg-muted/80 relative mb-2 h-3 w-full overflow-hidden rounded-full">
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
