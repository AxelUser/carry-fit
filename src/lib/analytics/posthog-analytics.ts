import { AnalyticsProvider } from './analytics-provider';
import type { EventProperties } from './analytics-provider';
import { posthog } from 'posthog-js';
import * as env from '$env/static/public';
import { isLocalhost } from '$lib/utils/environment';
import { browser } from '$app/environment';

export class PosthogAnalytics extends AnalyticsProvider {
	private initialized = false;

	init(consent: boolean): void {
		if (
			!('PUBLIC_POSTHOG_API_KEY' in env) ||
			!('PUBLIC_POSTHOG_HOST' in env) ||
			typeof env.PUBLIC_POSTHOG_API_KEY !== 'string' ||
			typeof env.PUBLIC_POSTHOG_HOST !== 'string'
		) {
			console.warn('PostHog API key or host not found or invalid. Analytics will be disabled.');
			return;
		}

		if (!browser || isLocalhost()) {
			console.warn('Analytics will be disabled in non-browser or localhost environments.');
			return;
		}

		posthog.init(env.PUBLIC_POSTHOG_API_KEY, {
			api_host: env.PUBLIC_POSTHOG_HOST,
			person_profiles: 'always',
			persistence: consent ? 'localStorage+cookie' : 'memory',
			autocapture: false
		});
		this.initialized = true;
	}

	public updateConsent(consent: boolean) {
		if (typeof posthog !== 'undefined' && this.initialized) {
			posthog.set_config({ persistence: consent ? 'localStorage+cookie' : 'memory' });
		}
	}

	protected trackEventInternal(eventName: string, properties?: EventProperties): void {
		if (typeof posthog !== 'undefined') {
			posthog.capture(eventName, { ...properties });
		}
	}
}

export const posthogAnalytics = new PosthogAnalytics();
