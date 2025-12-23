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

	const BACKPACK_IMAGE_PATH = '/backpack/backpack-fill.png';

	let imageEl = $state<HTMLImageElement | null>(null);
	let isDragging = $state(false);
	let startFillPercentage = $state(0);
	let startY = $state(0);

	function clampFillPercentage(value: number): number {
		const snapped = Math.round(value / FLEXIBILITY_STEP_PERCENTAGE) * FLEXIBILITY_STEP_PERCENTAGE;
		return Math.max(
			FLEXIBILITY_MIN_FILL_PERCENTAGE,
			Math.min(FLEXIBILITY_MAX_FILL_PERCENTAGE, snapped)
		);
	}

	function getClientY(event: MouseEvent | TouchEvent): number | null {
		if ('touches' in event) {
			return event.touches.length > 0 ? event.touches[0].clientY : null;
		}
		return event.clientY;
	}

	function updateFillFromDelta(deltaY: number) {
		if (!imageEl) return;

		const percentageDelta = (deltaY / imageEl.offsetHeight) * 100;
		// Dragging down increases fill (negative delta), so we subtract to increase fill percentage
		const newFill = clampFillPercentage(startFillPercentage - percentageDelta);

		if (newFill !== fillPercentage) {
			fillPercentage = newFill;
			onFillPercentageChange?.(newFill);
		}
	}

	function handlePointerDown(event: MouseEvent | TouchEvent) {
		const clientY = getClientY(event);
		if (!imageEl || clientY === null) return;

		isDragging = true;
		startFillPercentage = fillPercentage;
		startY = clientY;
		event.preventDefault();
	}

	function handlePointerMove(event: MouseEvent | TouchEvent) {
		if (isDragging) {
			const clientY = getClientY(event);
			if (clientY === null) return;

			const deltaY = clientY - startY;
			updateFillFromDelta(deltaY);

			// Prevent scrolling during drag on mobile devices
			if ('touches' in event) {
				event.preventDefault();
			}
		}
	}

	function handlePointerUp() {
		isDragging = false;
	}

	function handleKeyDown(event: KeyboardEvent) {
		const { key } = event;

		let newFillPercentage = fillPercentage;

		if (key === 'ArrowLeft' || key === 'ArrowDown') {
			newFillPercentage = clampFillPercentage(fillPercentage - FLEXIBILITY_STEP_PERCENTAGE);
			event.preventDefault();
		} else if (key === 'ArrowRight' || key === 'ArrowUp') {
			newFillPercentage = clampFillPercentage(fillPercentage + FLEXIBILITY_STEP_PERCENTAGE);
			event.preventDefault();
		}

		if (newFillPercentage !== fillPercentage) {
			fillPercentage = newFillPercentage;
			onFillPercentageChange?.(newFillPercentage);
		}
	}

	function pointerDragAction(node: HTMLElement) {
		// Touch events are passive by default in Svelte 5
		// see https://svelte.dev/docs/svelte/v5-migration-guide#Breaking-changes-in-runes-mode-Touch-and-wheel-events-are-passive
		const touchStartOptions = { passive: false };
		const touchMoveOptions = { passive: false };

		node.addEventListener('mousedown', handlePointerDown);
		node.addEventListener('touchstart', handlePointerDown, touchStartOptions);
		window.addEventListener('mousemove', handlePointerMove);
		window.addEventListener('mouseup', handlePointerUp);
		window.addEventListener('touchmove', handlePointerMove, touchMoveOptions);
		window.addEventListener('touchend', handlePointerUp);

		return {
			destroy() {
				node.removeEventListener('mousedown', handlePointerDown);
				node.removeEventListener('touchstart', handlePointerDown);
				window.removeEventListener('mousemove', handlePointerMove);
				window.removeEventListener('mouseup', handlePointerUp);
				window.removeEventListener('touchmove', handlePointerMove);
				window.removeEventListener('touchend', handlePointerUp);
			}
		};
	}

	// Ensure fill percentage stays within bounds when changed externally
	$effect(() => {
		fillPercentage = clampFillPercentage(fillPercentage);
	});

	const fillPosition = $derived(
		imageEl ? (imageEl.offsetHeight * (100 - fillPercentage)) / 100 : 0
	);
</script>

<div class="relative mx-auto flex h-[150px] w-full max-w-[200px] items-center justify-center">
	<div
		class="relative mt-5 block h-full w-auto cursor-grab touch-none select-none active:cursor-grabbing"
		use:pointerDragAction
		onkeydown={handleKeyDown}
		role="slider"
		tabindex={0}
		aria-valuemin={FLEXIBILITY_MIN_FILL_PERCENTAGE}
		aria-valuemax={FLEXIBILITY_MAX_FILL_PERCENTAGE}
		aria-valuenow={fillPercentage}
		aria-label="Fill percentage"
		style="--fill-position: {fillPosition}px;"
	>
		<img
			bind:this={imageEl}
			src={BACKPACK_IMAGE_PATH}
			alt="Backpack fill visualization"
			class="h-full w-auto object-contain"
			draggable="false"
		/>

		<div
			class="mask-overlay bg-primary pointer-events-none absolute inset-0 z-0 opacity-60 mix-blend-multiply"
		></div>

		<div class="indicator-line pointer-events-none absolute right-0 left-0 z-10">
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

<style>
	.mask-overlay {
		mask-image:
			url('/backpack/backpack-fill.png'),
			linear-gradient(to bottom, transparent var(--fill-position), black var(--fill-position));
		mask-composite: intersect;
		-webkit-mask-composite: source-in;
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
	}

	.indicator-line {
		top: var(--fill-position);
		height: 2px;
		transform: translateY(-1px);
	}
</style>
