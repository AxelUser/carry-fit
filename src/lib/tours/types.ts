import type { DriveStep } from 'driver.js';

export const TOURS = {
	newUserV1: 'newUserV1'
} as const;

export type TourNames = (typeof TOURS)[keyof typeof TOURS];

export interface Tour {
	steps: () => DriveStep[];
}
