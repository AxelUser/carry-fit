import type { DriveStep } from 'driver.js';

export const TOURS = {
	onboarding: 'onboarding',
	airlineSearch: 'airlineSearch'
} as const;

export type TourName = keyof typeof TOURS;

export interface Tour {
	name: TourName;
	steps: () => DriveStep[];
	updatedAt: Date;
}
