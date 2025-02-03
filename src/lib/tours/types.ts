import type { DriveStep } from 'driver.js';

export const TOURS = {
	onboarding: 'onboarding',
	airlineSearch: 'airlineSearch'
} as const;

export interface Tour {
	name: string;
	steps: () => DriveStep[];
	updatedAt: Date;
}
