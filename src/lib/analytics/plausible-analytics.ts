import type { EventProperties } from './analytics-service';
import { AnalyticsService } from './analytics-service';

export class PlausibleAnalytics extends AnalyticsService {
	protected trackEventInternal(eventName: string, properties?: EventProperties): void {
		if (typeof plausible !== 'undefined') {
			plausible(eventName, { props: properties });
		}
	}
}
