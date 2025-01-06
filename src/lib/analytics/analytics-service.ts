export interface EventProperties {
	[key: string]: string | number | boolean;
}

export interface AnalyticsService {
	trackEvent(eventName: string, properties?: EventProperties): void;
}
