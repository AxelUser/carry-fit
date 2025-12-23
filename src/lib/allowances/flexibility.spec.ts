import { describe, it, expect } from 'vitest';
import { calculateFlexibility } from './flexibility';
import type { UserDimensions } from '$lib/types';

describe('calculateFlexibility', () => {
	describe('Basic calculations', () => {
		it('should return zero budgets for 100% fill', () => {
			const dimensions: UserDimensions = { height: 60, width: 40, depth: 23 };
			const budgets = calculateFlexibility(dimensions, 100);

			expect(budgets).toEqual([0, 0, 0]);
		});

		it('should calculate budgets for 80% fill', () => {
			const dimensions: UserDimensions = { height: 60, width: 40, depth: 23 };
			const budgets = calculateFlexibility(dimensions, 80);

			// 20% empty = 0.2
			// Height: 60 * 0.2 = 12
			// Width: 40 * 0.2 = 8
			// Depth: 23 * 0.2 = 4.6
			// Sorted descending: [12, 8, 4.6]
			expect(budgets[0]).toBeCloseTo(12, 1);
			expect(budgets[1]).toBeCloseTo(8, 1);
			expect(budgets[2]).toBeCloseTo(4.6, 1);
		});

		it('should calculate budgets for 70% fill', () => {
			const dimensions: UserDimensions = { height: 60, width: 40, depth: 23 };
			const budgets = calculateFlexibility(dimensions, 70);

			// 30% empty = 0.3
			// Height: 60 * 0.3 = 18
			// Width: 40 * 0.3 = 12
			// Depth: 23 * 0.3 = 6.9
			// Sorted descending: [18, 12, 6.9]
			expect(budgets[0]).toBeCloseTo(18, 1);
			expect(budgets[1]).toBeCloseTo(12, 1);
			expect(budgets[2]).toBeCloseTo(6.9, 1);
		});
	});

	describe('Budget sorting verification', () => {
		it('should maintain correct order when dimensions are already sorted', () => {
			const dimensions: UserDimensions = { height: 60, width: 40, depth: 23 };
			const budgets = calculateFlexibility(dimensions, 80);

			expect(budgets[0]).toBeGreaterThan(budgets[1]);
			expect(budgets[1]).toBeGreaterThan(budgets[2]);
		});

		it('should sort correctly when dimensions are in different order', () => {
			const dimensions: UserDimensions = { height: 23, width: 60, depth: 40 };
			const budgets = calculateFlexibility(dimensions, 80);

			expect(budgets[0]).toBeGreaterThan(budgets[1]);
			expect(budgets[1]).toBeGreaterThan(budgets[2]);
		});
	});

	describe('Edge cases', () => {
		it('should handle very small dimensions', () => {
			const dimensions: UserDimensions = { height: 10, width: 8, depth: 5 };
			const budgets = calculateFlexibility(dimensions, 80);

			// 20% empty
			// Height: 10 * 0.2 = 2
			// Width: 8 * 0.2 = 1.6
			// Depth: 5 * 0.2 = 1
			// Sorted: [2, 1.6, 1]
			expect(budgets[0]).toBeCloseTo(2, 1);
			expect(budgets[1]).toBeCloseTo(1.6, 1);
			expect(budgets[2]).toBeCloseTo(1, 1);
		});

		it('should handle very large dimensions', () => {
			const dimensions: UserDimensions = { height: 100, width: 80, depth: 50 };
			const budgets = calculateFlexibility(dimensions, 80);

			// 20% empty
			// Height: 100 * 0.2 = 20
			// Width: 80 * 0.2 = 16
			// Depth: 50 * 0.2 = 10
			// Sorted: [20, 16, 10]
			expect(budgets[0]).toBeCloseTo(20, 1);
			expect(budgets[1]).toBeCloseTo(16, 1);
			expect(budgets[2]).toBeCloseTo(10, 1);
		});

		it('should handle asymmetric bags', () => {
			const dimensions: UserDimensions = { height: 80, width: 30, depth: 20 };
			const budgets = calculateFlexibility(dimensions, 80);

			// 20% empty
			// Height: 80 * 0.2 = 16
			// Width: 30 * 0.2 = 6
			// Depth: 20 * 0.2 = 4
			// Sorted: [16, 6, 4]
			expect(budgets[0]).toBeCloseTo(16, 1);
			expect(budgets[1]).toBeCloseTo(6, 1);
			expect(budgets[2]).toBeCloseTo(4, 1);
		});

		it('should handle square bags', () => {
			const dimensions: UserDimensions = { height: 40, width: 40, depth: 40 };
			const budgets = calculateFlexibility(dimensions, 80);

			// All dimensions equal, budgets should be equal
			// 40 * 0.2 = 8 for each
			expect(budgets[0]).toBeCloseTo(8, 1);
			expect(budgets[1]).toBeCloseTo(8, 1);
			expect(budgets[2]).toBeCloseTo(8, 1);
		});
	});
});
