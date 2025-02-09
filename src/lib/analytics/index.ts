import { Metrics } from './metrics';
import { posthogAnalytics as analyticsProvider } from './posthog-analytics';

function updateConsent(consent: boolean) {
	analyticsProvider.updateConsent(consent);
}

function disposeAnalytics() {
	analyticsProvider.cancelDebouncedEvents();
}

function initAnalytics(consent: boolean) {
	analyticsProvider.init(consent);
}

const metrics = new Metrics(analyticsProvider);

export { metrics, initAnalytics, updateConsent, disposeAnalytics };
