<script lang="ts">
	import { onMount } from 'svelte';
	import { getScoreVisual } from '$lib/allowances';
	import { cn } from '$lib/utils/styling';

	interface Props {
		carryOnScore: number;
		personalItemScore: number;
		showBackground?: boolean;
	}

	let { carryOnScore, personalItemScore, showBackground = true }: Props = $props();

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
</script>

<div
	class="relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 text-center shadow-sm"
>
	{#if shouldAnimateBackground}
		<canvas
			class="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-25"
			bind:this={canvasEl}
		></canvas>
	{/if}

	<div class="relative z-20 mx-auto max-w-4xl p-4 sm:p-6">
		<div
			class="mb-4 text-2xl font-extrabold leading-tight text-foreground drop-shadow-lg sm:text-3xl"
		>
			{message}
		</div>

		<div class="grid grid-cols-2 gap-4">
			{@render complianceScoreResults('Carry-on', carryOnScore, carryOnClasses)}

			{@render complianceScoreResults('Personal Item', personalItemScore, personalItemClasses)}
		</div>
	</div>
</div>

{#snippet complianceScoreResults(
	label: string,
	percentage: number,
	classes: { text: string; bar: string }
)}
	<div class="flex flex-col items-center">
		<div class="text-md mb-2 font-semibold text-foreground drop-shadow-sm">{label}</div>
		<div class="relative mb-2 h-3 w-full overflow-hidden rounded-full bg-muted/80">
			<div
				class={cn('h-full transition-all duration-500 ease-out', classes.bar)}
				style="width: {percentage}%"
			></div>
		</div>
		<div class={cn('text-2xl font-black tracking-tight drop-shadow-sm sm:text-3xl', classes.text)}>
			{percentage.toFixed(0)}%
		</div>
	</div>
{/snippet}
