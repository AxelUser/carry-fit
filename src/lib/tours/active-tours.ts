import { type Tour, type TourName, TOURS } from './types';
import { onboardingTour } from './onboarding.tour';
import { airlineSearchTour } from './airline-search.tour';

export const MAIN_TOUR = onboardingTour;

const activeTours: Record<TourName, Tour> = {
	[TOURS.onboarding]: onboardingTour,
	[TOURS.airlineSearch]: airlineSearchTour
};

export function getActiveTours(): Tour[] {
	return Object.values(activeTours);
}

export function exists(tour: TourName): boolean {
	return activeTours[tour] !== undefined;
}
