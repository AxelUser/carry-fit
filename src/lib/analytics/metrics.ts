import { MeasurementSystems, type MeasurementSystem, type UserDimensions } from '$lib/types';
import type { AnalyticsProvider } from './analytics-provider';

export class Metrics {
	constructor(private provider: AnalyticsProvider) {}

	changelogOpened(versionDate: Date, isNewVersion: boolean) {
		this.provider.trackEventDebounced(
			'changelog_opened',
			{
				version_date: versionDate.toISOString(),
				is_new_version: isNewVersion
			},
			3000
		);
	}

	errorOccurred(error: Error | null) {
		this.provider.trackEvent('carryfit_error');
	}

	favoriteAirlineToggled() {
		this.provider.trackEventDebounced('favorite_airline_toggled', undefined, 3000);
	}

	userBagValidated(
		depth: number,
		width: number,
		height: number,
		measurementSystem: MeasurementSystem,
		showFlexibility: boolean,
		flexibility: number
	) {
		const eventProps: Record<string, string | number> = {
			user_bag_dimensions: `${depth}x${width}x${height} ${measurementSystem === MeasurementSystems.Metric ? 'cm' : 'in'}`
		};

		if (showFlexibility) {
			eventProps.user_bag_flexibility = flexibility;
		}

		this.provider.trackEventDebounced('user_bag_validated', eventProps, 3000);
	}

	favoritesFilterEnabled(favoriteAirlinesCount: number) {
		this.provider.trackEventDebounced(
			'favorites_filter_enabled',
			{
				favorites_count: favoriteAirlinesCount
			},
			3000
		);
	}

	easterEggShown(name: string) {
		this.provider.trackEventDebounced('easter_egg_shown', { name }, 2000);
	}
}
