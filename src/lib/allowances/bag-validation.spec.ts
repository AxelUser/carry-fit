import { describe, it, expect } from 'vitest';
import { checkCompliance } from '$lib/allowances';

describe('Bag Validator', () => {
	it('should return null when bag dimensions is empty', () => {
		expect(checkCompliance([56, 36, 23], [])).toBeNull();
	});

	describe('Per dimension measurements', () => {
		it('should pass when bag dimensions are exactly equal', () => {
			const dimensions = [56, 36, 23];
			expect(checkCompliance([56, 36, 23], dimensions)).toEqual([true, true, true]);
		});

		it('should pass when bag dimensions are smaller', () => {
			const dimensions = [50, 30, 20];
			expect(checkCompliance([56, 36, 23], dimensions)).toEqual([true, true, true]);
		});

		it('should fail when bag dimensions are larger', () => {
			const dimensions = [60, 40, 25];
			expect(checkCompliance([56, 36, 23], dimensions)).toEqual([false, false, false]);
		});
	});

	describe('Dimension order handling', () => {
		it('should pass regardless of dimension order', () => {
			const dimensions = [23, 56, 36]; // Smallest, Largest, Middle
			expect(checkCompliance([56, 36, 23], dimensions)).toEqual([true, true, true]);
		});

		it('should handle mixed dimension sizes correctly', () => {
			const dimensions = [50, 40, 23]; // Smaller, Larger, Equal
			expect(checkCompliance([56, 36, 23], dimensions)).toEqual([true, false, true]);
		});
	});

	describe('Total size limit', () => {
		it('should pass when total size is exactly equal', () => {
			const dimensions = [50, 40, 25];
			expect(checkCompliance([115], dimensions)).toEqual([true]);
		});

		it('should pass when total size is smaller', () => {
			const dimensions = [45, 35, 20];
			expect(checkCompliance([115], dimensions)).toEqual([true]);
		});

		it('should fail when total size is larger', () => {
			const dimensions = [55, 45, 30];
			expect(checkCompliance([115], dimensions)).toEqual([false]);
		});
	});

	describe('Flexibility handling', () => {
		describe('Per dimension measurements with flexibility', () => {
			it('should pass when single dimension exceeds within flexibility', () => {
				// 2cm over in one dimension
				expect(checkCompliance([56, 35, 23], [58, 35, 23], 3)).toEqual([true, true, true]);
			});

			it('should pass when multiple dimensions exceed within total flexibility', () => {
				// 1cm over in two dimensions (2cm total)
				expect(checkCompliance([56, 36, 23], [57, 37, 23], 3)).toEqual([true, true, true]);
			});

			it('should fail for one dimension exceeding total flexibility', () => {
				// 2cm + 2cm + 1cm = 5cm total over
				expect(checkCompliance([56, 36, 23], [58, 38, 24], 3)).toEqual([true, false, true]);
			});

			it('should handle flexibility of 0', () => {
				// 1cm over in one dimension
				expect(checkCompliance([56, 36, 23], [57, 36, 23], 0)).toEqual([false, true, true]);
			});
		});

		describe('Total size limit with flexibility', () => {
			it('should pass when total size exceeds within flexibility', () => {
				// 116 total, 1 over
				expect(checkCompliance([115], [50, 40, 26], 2)).toEqual([true]);
			});

			it('should fail when total size exceeds flexibility', () => {
				// 118 total, 3 over
				expect(checkCompliance([115], [50, 40, 28], 2)).toEqual([false]);
			});
		});
	});
});
