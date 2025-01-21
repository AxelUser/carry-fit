import { AnalyticsProvider } from './analytics-provider';
import type { EventProperties } from './analytics-provider';
import { plausibleAnalytics } from './plausible-analytics';
import { posthogAnalytics } from './posthog-analytics';

const analytics = [plausibleAnalytics, posthogAnalytics];

class MergedAnalytics extends AnalyticsProvider {
	protected trackEventInternal(eventName: string, properties?: EventProperties): void {
		analytics.forEach((analytics) => analytics.trackEvent(eventName, properties));
	}

	updateConsent(consent: boolean): void {
		analytics.forEach((analytics) => analytics.updateConsent(consent));
	}
}

export const mergedAnalytics = new MergedAnalytics();
