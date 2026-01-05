import { ElementSize, watch } from 'runed';

type SpeedFunction = (currentTs: number) => number;

interface AnimationConfig {
	horizontalSpeedFn: SpeedFunction;
	verticalSpeedFn: SpeedFunction;
}

const defaultHorizontalSpeed: SpeedFunction = () => 24;
const defaultVerticalSpeed: SpeedFunction = () => -24;

export class BackgroundRenderer {
	rafId: number | null = null;
	private loop: () => void;

	private readonly config = {
		emojiSize: 56,
		gap: 32,
		skewRatio: 0.35,
		opacity: 0.6,
		renderPadding: 1
	};

	private animationConfig: AnimationConfig;

	private lastTs = 0;
	private offsetX = 0;
	private offsetY = 0;

	constructor(
		private canvasGetter: () => HTMLCanvasElement | null | undefined,
		private imgGetter: () => HTMLImageElement | null | undefined,
		animationConfig?: Partial<AnimationConfig>
	) {
		this.animationConfig = {
			horizontalSpeedFn: animationConfig?.horizontalSpeedFn ?? defaultHorizontalSpeed,
			verticalSpeedFn: animationConfig?.verticalSpeedFn ?? defaultVerticalSpeed
		};

		const size = new ElementSize(() => canvasGetter());

		watch([() => size.current.width, () => size.current.height], () => {
			this.resize();
		});

		this.loop = () => {
			const canvas = canvasGetter();
			if (!canvas) {
				this.rafId = requestAnimationFrame(this.loop);
				return;
			}

			const ctx = canvas.getContext('2d');
			const img = imgGetter();
			const rect = canvas.getBoundingClientRect();

			if (rect.width === 0 || rect.height === 0) {
				this.rafId = requestAnimationFrame(this.loop);
				return;
			}

			if (!ctx || !img) {
				this.rafId = requestAnimationFrame(this.loop);
				return;
			}

			const ts = performance.now();
			this.draw(ctx, rect.width, rect.height, img, ts);
			this.rafId = requestAnimationFrame(this.loop);
		};
	}

	public start() {
		if (this.rafId !== null) {
			return;
		}
		this.lastTs = 0;
		this.resize();
		this.rafId = requestAnimationFrame(this.loop);
	}

	public stop() {
		if (this.rafId === null) {
			return;
		}
		cancelAnimationFrame(this.rafId);
		this.rafId = null;
	}

	draw(
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		img: HTMLImageElement,
		ts: number
	) {
		const delta = this.lastTs ? (ts - this.lastTs) / 1000 : 0;
		this.lastTs = ts;

		const currentHorizontalSpeed = this.animationConfig.horizontalSpeedFn(ts);
		const currentVerticalSpeed = this.animationConfig.verticalSpeedFn(ts);

		this.offsetX += currentHorizontalSpeed * delta;
		this.offsetY += currentVerticalSpeed * delta;

		ctx.clearRect(0, 0, width, height);
		ctx.save();
		ctx.globalAlpha = this.config.opacity;

		const { emojiSize, gap, skewRatio, renderPadding } = this.config;
		const cellSize = emojiSize + gap;
		const skewOffset = cellSize * skewRatio;
		const padding = renderPadding * cellSize;

		const startX = (((this.offsetX % cellSize) + cellSize) % cellSize) - padding;
		const colCount = Math.ceil((width + 2 * padding) / cellSize) + 1;

		for (let col = 0; col < colCount; col++) {
			const tileX = startX + col * cellSize;

			const baseY =
				this.offsetY - (Math.floor(this.offsetX / cellSize) + renderPadding) * skewOffset;
			const colSkew = col * skewOffset;
			const startY = ((((baseY - colSkew) % cellSize) + cellSize) % cellSize) - padding;

			for (let tileY = startY; tileY < height + padding; tileY += cellSize) {
				ctx.drawImage(img, tileX, tileY, emojiSize, emojiSize);
			}
		}

		ctx.restore();
	}

	resize() {
		const canvas = this.canvasGetter();
		if (!canvas) {
			return;
		}

		const dpr = window.devicePixelRatio || 1;

		let rect = canvas.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) {
			rect = canvas.parentElement?.getBoundingClientRect() ?? rect;
		}

		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}
	}
}
