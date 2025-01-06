import type { AnalyticsService } from './analytics-service';
import { PlausibleAnalytics } from './plausible-analytics';

export const analyticsService: AnalyticsService = new PlausibleAnalytics();
