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

	dimensionParsingOpened() {
		this.provider.trackEvent('dimension_parsing_opened');
	}

	dimensionParsingUsed(success: boolean, text?: string) {
		const eventProps: Record<string, string | boolean> = {
			dimension_parsing_success: success
		};

		if (!success && text) {
			eventProps['dimension_parsing_failed_cropped_text'] = text.slice(0, 100);
		}

		this.provider.trackEvent('dimension_parsing_used', eventProps);
	}

	tourShown(tour: string) {
		this.provider.trackEvent('tour_shown', { tour_name: tour });
	}

	tourFinished(tour: string, completed: boolean) {
		this.provider.trackEvent('tour_finished', { tour_name: tour, tour_completed: completed });
	}

	airlineSearchPerformed(query: string) {
		if (query.length > 0) {
			const croppedQuery = query.slice(0, 30);
			this.provider.trackEventDebounced(
				'airline_search_performed',
				{ airline_search_query: croppedQuery },
				3000
			);
		}
	}

	favoriteAirlinesDialogOpened() {
		this.provider.trackEvent('favorite_airlines_dialog_opened');
	}
}
