import { Metrics } from './metrics';
import { mergedAnalytics as analyticsProvider } from './merged-analytics-provider';

function updateConsent(consent: boolean) {
	analyticsProvider.updateConsent(consent);
}

function disposeAnalytics() {
	analyticsProvider.cancelDebouncedEvents();
}

const metrics = new Metrics(analyticsProvider);

export { metrics, updateConsent, disposeAnalytics };
