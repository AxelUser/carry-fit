<script lang="ts">
	import {
		FLEXIBILITY_MIN_FILL_PERCENTAGE,
		FLEXIBILITY_MAX_FILL_PERCENTAGE,
		FLEXIBILITY_STEP_PERCENTAGE
	} from '$lib/allowances';
	interface Props {
		fillPercentage: number;
		onFillPercentageChange: (percentage: number) => void;
	}

	let { fillPercentage = $bindable(), onFillPercentageChange }: Props = $props();

	let containerEl = $state<HTMLDivElement | null>(null);
	let imageEl = $state<HTMLImageElement | null>(null);
	let isDragging = $state(false);
	let imageHeight = $state(0);

	function snapToStep(value: number): number {
		return Math.round(value / FLEXIBILITY_STEP_PERCENTAGE) * FLEXIBILITY_STEP_PERCENTAGE;
	}

	function clampFillPercentage(value: number): number {
		const snapped = snapToStep(value);
		return Math.max(
			FLEXIBILITY_MIN_FILL_PERCENTAGE,
			Math.min(FLEXIBILITY_MAX_FILL_PERCENTAGE, snapped)
		);
	}

	function getFillPosition(): number {
		if (!imageHeight) return 0;
		return (imageHeight * (100 - fillPercentage)) / 100;
	}

	function updateFillFromY(y: number) {
		if (!containerEl || !imageEl) return;

		const rect = containerEl.getBoundingClientRect();
		const imageRect = imageEl.getBoundingClientRect();
		const relativeY = y - imageRect.top;

		if (relativeY < 0 || relativeY > imageRect.height) return;

		const percentage = 100 - (relativeY / imageRect.height) * 100;
		const newFill = clampFillPercentage(percentage);

		if (newFill !== fillPercentage) {
			fillPercentage = newFill;
			onFillPercentageChange?.(newFill);
		}
	}

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		updateFillFromY(event.clientY);
		event.preventDefault();
	}

	function handleMouseMove(event: MouseEvent) {
		if (isDragging) {
			updateFillFromY(event.clientY);
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleTouchStart(event: TouchEvent) {
		if (event.touches.length > 0) {
			isDragging = true;
			updateFillFromY(event.touches[0].clientY);
			event.preventDefault();
		}
	}

	function handleTouchMove(event: TouchEvent) {
		if (isDragging && event.touches.length > 0) {
			updateFillFromY(event.touches[0].clientY);
			event.preventDefault();
		}
	}

	function handleTouchEnd() {
		isDragging = false;
	}

	function handleImageLoad() {
		if (imageEl) {
			imageHeight = imageEl.offsetHeight;
		}
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			window.addEventListener('touchmove', handleTouchMove);
			window.addEventListener('touchend', handleTouchEnd);

			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('mouseup', handleMouseUp);
				window.removeEventListener('touchmove', handleTouchMove);
				window.removeEventListener('touchend', handleTouchEnd);
			};
		}
	});

	$effect(() => {
		fillPercentage = clampFillPercentage(fillPercentage);
	});

	const fillPosition = $derived(getFillPosition());
	const maskHeight = $derived(imageHeight - fillPosition);
</script>

<div
	bind:this={containerEl}
	class="relative mx-auto flex h-[150px] w-full max-w-[200px] items-center justify-center"
>
	<div class="relative h-full w-full">
		<picture class="relative block h-full w-full">
			<source srcset="/backpack/backpack-fill.webp" type="image/webp" />
			<img
				bind:this={imageEl}
				src="/backpack/backpack-fill.png"
				alt="Backpack fill visualization"
				class="h-full w-full object-contain"
				onload={handleImageLoad}
			/>
		</picture>

		<div
			class="bg-primary pointer-events-none absolute right-0 bottom-0 left-0 z-0 mix-blend-multiply"
			style="height: {maskHeight}px; opacity: 0.4;"
		></div>

		<div
			class="absolute right-0 left-0 z-10 cursor-grab active:cursor-grabbing"
			style="top: {fillPosition}px; height: 2px; transform: translateY(-1px);"
			onmousedown={handleMouseDown}
			ontouchstart={handleTouchStart}
			role="slider"
			tabindex={0}
			aria-valuemin={FLEXIBILITY_MIN_FILL_PERCENTAGE}
			aria-valuemax={FLEXIBILITY_MAX_FILL_PERCENTAGE}
			aria-valuenow={fillPercentage}
			aria-label="Fill percentage"
		>
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<div
					class="bg-card border-primary flex items-center justify-center rounded-md border px-2 py-1 shadow-sm"
				>
					<span class="text-primary text-sm font-semibold">{fillPercentage}%</span>
				</div>
			</div>
		</div>
	</div>
</div>
