import { driver, type DriveStep } from 'driver.js';
import { newUserTour } from './new-user.tour';
import type { Tour } from './types';
import { metrics } from '$lib/analytics';
import 'driver.js/dist/driver.css';

type TourNames = 'new-user';

const tours: Record<TourNames, Tour> = {
	'new-user': newUserTour
};

function createDriver(name: string, steps: DriveStep[]) {
	const driverObj = driver({
		showProgress: true,
		steps: steps,
		nextBtnText: 'Next →',
		prevBtnText: '← Previous',
		doneBtnText: 'Done',
		overlayColor: 'rgba(0, 0, 0, 0.5)',
		stagePadding: 5,
		animate: true,
		popoverClass: 'tour-popover',
		onDestroyStarted: () => {
			const completed = driverObj.isLastStep();
			if (completed) {
				metrics.tourCompleted(name);
			}
			driverObj.destroy();
		}
	});

	return driverObj;
}

function canRunTour(tour: TourNames): boolean {
	const tourData = tours[tour];

	return tourData !== undefined;
}

export function showTour(tour: TourNames) {
	if (!canRunTour(tour)) {
		return;
	}

	const tourData = tours[tour];

	const driver = createDriver(tour, tourData.steps());
	driver.drive();

	metrics.tourShown(tour);
}
