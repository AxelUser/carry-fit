import type { AnalyticsService, EventProperties } from './analytics-service';

export class PlausibleAnalytics implements AnalyticsService {
	trackEvent(eventName: string, properties?: EventProperties): void {
		if (typeof plausible !== 'undefined') {
			plausible(eventName, { props: properties });
		}
	}
}
