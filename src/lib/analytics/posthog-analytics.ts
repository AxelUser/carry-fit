import { AnalyticsService } from './analytics-service';
import type { EventProperties } from './analytics-service';
import { posthog } from 'posthog-js';
import { PUBLIC_POSTHOG_API_KEY } from '$env/static/public';
import { isLocalhost } from '$lib/utils';
import { browser } from '$app/environment';

export class PosthogAnalytics extends AnalyticsService {
	constructor() {
		super();

		if (browser && !isLocalhost()) {
			posthog.init(PUBLIC_POSTHOG_API_KEY, {
				api_host: 'https://us.i.posthog.com',
				person_profiles: 'always',
				autocapture: false
			});
		}
	}

	protected trackEventInternal(eventName: string, properties?: EventProperties): void {
		if (typeof posthog !== 'undefined') {
			posthog.capture(eventName, { ...properties });
		}
	}
}
