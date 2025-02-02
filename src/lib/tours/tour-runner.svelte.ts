import { driver, type DriveStep } from 'driver.js';
import { newUserTour } from './new-user.tour';
import { TOURS, type Tour, type TourNames } from './types';
import { metrics } from '$lib/analytics';
import tourProgress from '$lib/stores/tours';
import 'driver.js/dist/driver.css';

const activeTours: Record<TourNames, Tour> = {
	[TOURS.newUserV1]: newUserTour
};

function createDriver(name: TourNames, steps: DriveStep[]) {
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
			metrics.tourFinished(name, completed);
			tourProgress.markTourCompleted(name);
			driverObj.destroy();
		}
	});

	return driverObj;
}

function canRunTour(tour: TourNames): boolean {
	return activeTours[tour] !== undefined && !tourProgress.isTourCompleted(tour);
}

export function showTour(tour: TourNames, force = false) {
	if (!canRunTour(tour) && !force) {
		return;
	}

	const tourData = activeTours[tour];
	const driver = createDriver(tour, tourData.steps());
	driver.drive();

	metrics.tourShown(tour);
}
