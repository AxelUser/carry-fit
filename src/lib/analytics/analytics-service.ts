import { debounce } from '$lib/utils';

export interface EventProperties {
	[key: string]: string | number | boolean;
}

export abstract class AnalyticsService {
	private debouncedEvents: Map<string, ReturnType<typeof debounce<[EventProperties?], void>>> =
		new Map();

	abstract trackEvent(eventName: string, properties?: EventProperties): void;

	trackEventDebounced(
		eventName: string,
		properties?: EventProperties,
		waitMs: number = 5000
	): void {
		if (!this.debouncedEvents.has(eventName)) {
			const debouncedFn = debounce<[EventProperties?], void>((props?: EventProperties) => {
				this.trackEvent(eventName, props);
			}, waitMs);
			this.debouncedEvents.set(eventName, debouncedFn);
		}

		const debouncedFn = this.debouncedEvents.get(eventName);
		debouncedFn?.(properties);
	}

	cancelDebouncedEvents(): void {
		for (const debouncedFn of this.debouncedEvents.values()) {
			debouncedFn.cancel();
		}
		this.debouncedEvents.clear();
	}
}
