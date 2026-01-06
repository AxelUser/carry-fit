export class ImageLoader {
	private cache = new Map<string, Promise<HTMLImageElement>>();
	private currentSrc = $state<string | null>(null);
	current = $state<HTMLImageElement | null>(null);

	constructor(imageSrcGetter: () => string | null | undefined) {
		$effect(() => {
			const src = imageSrcGetter();
			if (src) {
				this.load(src);
			} else {
				this.current = null;
				this.currentSrc = null;
			}
		});
	}

	async load(src: string): Promise<void> {
		if (this.currentSrc === src && this.current) return;

		this.currentSrc = src;

		let promise = this.cache.get(src);
		if (!promise) {
			promise = new Promise<HTMLImageElement>((resolve, reject) => {
				const image = new Image();
				image.src = src;
				image.onload = () => resolve(image);
				image.onerror = reject;
			});
			this.cache.set(src, promise);
		}

		const loaded = await promise.catch(() => {
			this.cache.delete(src);
			return null;
		});
		if (!loaded || this.currentSrc !== src) return;

		this.current = loaded;
	}
}
