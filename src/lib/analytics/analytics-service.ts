import { browser } from '$app/environment';
import { debounce } from '$lib/utils/actions';
import { isLocalhost } from '$lib/utils/environment';

export interface EventProperties {
	[key: string]: string | number | boolean;
}

export abstract class AnalyticsService {
	private debouncedEvents: Map<string, ReturnType<typeof debounce<[EventProperties?], void>>> =
		new Map();

	protected abstract trackEventInternal(eventName: string, properties?: EventProperties): void;

	abstract updateConsent(consent: boolean): void;

	trackEvent(eventName: string, properties?: EventProperties) {
		if (browser && !isLocalhost()) {
			this.trackEventInternal(eventName, properties);
		}
	}

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
