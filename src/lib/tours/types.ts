import type { DriveStep } from 'driver.js';

export interface Tour {
	steps(): DriveStep[];
}
