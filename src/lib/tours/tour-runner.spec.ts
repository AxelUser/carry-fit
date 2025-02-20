import 'fake-indexeddb/auto';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getActiveTours, MAIN_TOUR } from './active-tours';
import tourStore from '$lib/stores/tours';
import type { Tour } from './types';
import { getPendingTours } from './tour-runner.svelte';

// Mock dependencies
vi.mock('./active-tours', () => ({
	MAIN_TOUR: {
		name: 'main-tour',
		updatedAt: new Date('2024-01-01'),
		steps: []
	} satisfies Tour,
	getActiveTours: vi.fn(),
	exists: vi.fn().mockReturnValue(true)
}));

vi.mock('$app/environment', () => ({
	browser: true
}));

describe('getPendingTours', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return empty array when no active tours', () => {
		vi.mocked(getActiveTours).mockReturnValue([]);

		const result = getPendingTours();
		expect(result).toEqual([]);
	});

	it('should filter out completed tours', () => {
		const mockTours: Tour[] = [
			{
				name: 'tour1',
				updatedAt: new Date('2024-01-01'),
				steps: []
			},
			{
				name: 'tour2',
				updatedAt: new Date('2024-01-01'),
				steps: []
			}
		];

		vi.mocked(getActiveTours).mockReturnValue(mockTours);

		// Mark tour1 as completed, tour2 is not completed
		tourStore.markTourCompleted('tour1');

		const result = getPendingTours();
		expect(result).toEqual([
			expect.objectContaining({
				tour: mockTours[1],
				skipped: expect.any(Boolean)
			})
		]);
	});

	it('should mark feature tours as skipped when main tour is pending', () => {
		const mockTours: Tour[] = [
			MAIN_TOUR,
			{
				name: 'feature-tour',
				updatedAt: new Date('2024-01-01'),
				steps: []
			}
		];

		vi.mocked(getActiveTours).mockReturnValue(mockTours);

		const result = getPendingTours();
		expect(result).toEqual([
			{ tour: MAIN_TOUR, skipped: false },
			{ tour: mockTours[1], skipped: true }
		]);
	});

	it('should not mark feature tours as skipped when main tour is completed', () => {
		const mockTours: Tour[] = [
			{
				name: 'feature-tour',
				updatedAt: new Date('2024-01-01'),
				steps: []
			}
		];

		vi.mocked(getActiveTours).mockReturnValue(mockTours);

		// Main tour is completed
		tourStore.markTourCompleted(MAIN_TOUR.name);

		const result = getPendingTours();
		expect(result).toEqual([{ tour: mockTours[0], skipped: false }]);
	});
});
