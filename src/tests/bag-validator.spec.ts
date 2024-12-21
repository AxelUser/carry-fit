import { describe, it, expect } from 'vitest';
import { checkCompliance } from '$lib/allowances';

describe('Bag Validator', () => {
	const testAirlineDimensions = [56, 36, 23]; // Using cm values directly

	it('should return null when bag dimensions is empty', () => {
		expect(checkCompliance(testAirlineDimensions, [])).toBeNull();
	});

	describe('Per dimension measurements', () => {
		it('should pass when bag dimensions are exactly equal', () => {
			const dimensions = [56, 36, 23];
			expect(checkCompliance(testAirlineDimensions, dimensions)).toEqual([true, true, true]);
		});

		it('should pass when bag dimensions are smaller', () => {
			const dimensions = [50, 30, 20];
			expect(checkCompliance(testAirlineDimensions, dimensions)).toEqual([true, true, true]);
		});

		it('should fail when bag dimensions are larger', () => {
			const dimensions = [60, 40, 25];
			expect(checkCompliance(testAirlineDimensions, dimensions)).toEqual([false, false, false]);
		});
	});

	describe('Dimension order handling', () => {
		it('should pass regardless of dimension order', () => {
			const dimensions = [23, 56, 36]; // Smallest, Largest, Middle
			expect(checkCompliance(testAirlineDimensions, dimensions)).toEqual([true, true, true]);
		});

		it('should handle mixed dimension sizes correctly', () => {
			const dimensions = [50, 40, 23]; // Smaller, Larger, Equal
			expect(checkCompliance(testAirlineDimensions, dimensions)).toEqual([true, false, true]);
		});
	});

	describe('Total size limit', () => {
		const totalSizeLimit = [115]; // Single element array for total size limit

		it('should pass when total size is exactly equal', () => {
			const dimensions = [50, 40, 25];
			expect(checkCompliance(totalSizeLimit, dimensions)).toEqual([true]);
		});

		it('should pass when total size is smaller', () => {
			const dimensions = [45, 35, 20];
			expect(checkCompliance(totalSizeLimit, dimensions)).toEqual([true]);
		});

		it('should fail when total size is larger', () => {
			const dimensions = [55, 45, 30];
			expect(checkCompliance(totalSizeLimit, dimensions)).toEqual([false]);
		});
	});
});
