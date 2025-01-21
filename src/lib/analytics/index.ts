import { AnalyticsService, type EventProperties } from './analytics-service';
import { PlausibleAnalytics } from './plausible-analytics';
import { PosthogAnalytics } from './posthog-analytics';

const analytics = [new PlausibleAnalytics(), new PosthogAnalytics()];

class MergedAnalytics extends AnalyticsService {
	protected trackEventInternal(eventName: string, properties?: EventProperties): void {
		analytics.forEach((analytics) => analytics.trackEvent(eventName, properties));
	}

	updateConsent(consent: boolean): void {
		analytics.forEach((analytics) => analytics.updateConsent(consent));
	}
}

export const analyticsService: AnalyticsService = new MergedAnalytics();
