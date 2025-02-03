import { type Tour, TOURS } from './types';
import { onboardingTour } from './onboarding.tour';
import { airlineSearchTour } from './airline-search.tour';

export const MAIN_TOUR = onboardingTour;

const activeTours: Record<string, Tour> = {
	[TOURS.onboarding]: onboardingTour,
	[TOURS.airlineSearch]: airlineSearchTour
};

export function getActiveTours(): Tour[] {
	return Object.values(activeTours);
}

export function exists(tour: string): boolean {
	return activeTours[tour] !== undefined;
}
