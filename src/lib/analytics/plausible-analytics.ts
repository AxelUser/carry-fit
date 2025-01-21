import type { EventProperties } from './analytics-provider';
import { AnalyticsProvider } from './analytics-provider';

class PlausibleAnalytics extends AnalyticsProvider {
	protected trackEventInternal(eventName: string, properties?: EventProperties): void {
		if (typeof plausible !== 'undefined') {
			plausible(eventName, { props: properties });
		}
	}

	updateConsent(consent: boolean): void {
		// No-op
	}
}

export const plausibleAnalytics = new PlausibleAnalytics();
