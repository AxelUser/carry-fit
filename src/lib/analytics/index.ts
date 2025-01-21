import { AnalyticsService, type EventProperties } from './analytics-service';
import { PlausibleAnalytics } from './plausible-analytics';
import { posthogAnalytics } from './posthog-analytics';

const analytics = [new PlausibleAnalytics(), posthogAnalytics];

class MergedAnalytics extends AnalyticsService {
	protected trackEventInternal(eventName: string, properties?: EventProperties): void {
		analytics.forEach((analytics) => analytics.trackEvent(eventName, properties));
	}
}

export const analyticsService: AnalyticsService = new MergedAnalytics();
