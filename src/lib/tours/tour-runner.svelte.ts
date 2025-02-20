import { driver, type DriveStep } from 'driver.js';
import { metrics } from '$lib/analytics';
import tourStore from '$lib/stores/tours';
import 'driver.js/dist/driver.css';
import type { Tour } from './types';
import { exists, getActiveTours, MAIN_TOUR } from './active-tours';

function createDriver(name: string, steps: DriveStep[], onDestroyed?: () => void) {
	const isDark = document.documentElement.classList.contains('dark');
	const overlayColor = isDark
		? 'hsl(var(--background) / 0.8) brightness(150%)'
		: 'hsl(var(--background) / 0.8) brightness(50%)';

	const driverObj = driver({
		showProgress: true,
		steps: steps,
		nextBtnText: 'Next →',
		prevBtnText: '← Previous',
		doneBtnText: 'Done',
		overlayColor,
		stagePadding: 5,
		animate: true,
		popoverClass: 'tour-popover',
		onDestroyStarted: () => {
			const completed = driverObj.isLastStep();
			metrics.tourFinished(name, completed);
			tourStore.markTourCompleted(name);
			driverObj.destroy();
		},
		onDestroyed: onDestroyed
	});

	return driverObj;
}

function isFeatureTour(tour: Tour): boolean {
	return tour.name !== MAIN_TOUR.name;
}

function mainTourPending(): boolean {
	return !tourStore.isTourCompleted(MAIN_TOUR.name, MAIN_TOUR.updatedAt);
}

function canRunTour(tour: Tour): boolean {
	// Tour must exist and not be completed
	if (!exists(tour.name) || tourStore.isTourCompleted(tour.name, tour.updatedAt)) {
		return false;
	}

	return true;
}

interface PendingTour {
	tour: Tour;
	skipped: boolean;
}

export function getPendingTours(): PendingTour[] {
	const activeTours = getActiveTours();

	return (
		activeTours
			.filter((tour) => !tourStore.isTourCompleted(tour.name, tour.updatedAt))
			// If the main tour is pending, we don't want to show any feature tours,
			// because the main tour will cover all features
			.map((tour) => ({ tour, skipped: isFeatureTour(tour) && mainTourPending() }))
	);
}

function showTour(tour: Tour, force = false, onDestroyed?: () => void) {
	if (!canRunTour(tour) && !force) {
		return;
	}

	const driver = createDriver(tour.name, tour.steps, onDestroyed);
	driver.drive();

	metrics.tourShown(tour.name);
}

export function runMainTour() {
	showTour(MAIN_TOUR, true);
}

export function runPendingTours() {
	if (tourStore.disabled) {
		return;
	}

	const pendingTours = getPendingTours().filter((tour) => {
		if (tour.skipped) {
			// Mark skipped tours as completed, so they don't show up again
			tourStore.markTourCompleted(tour.tour.name);
			return false;
		}
		return true;
	});

	if (pendingTours.length > 0) {
		let currentIdx = 0;
		function showNextTour() {
			showTour(pendingTours[currentIdx].tour, false, () => {
				if (currentIdx < pendingTours.length - 1) {
					currentIdx++;
					showNextTour();
				}
			});
		}

		showNextTour();
	}
}
