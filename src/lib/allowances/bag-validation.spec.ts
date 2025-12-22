import { describe, it, expect } from 'vitest';
import { checkCompliance } from '$lib/allowances';
import { descDimensions } from '$lib/utils/dimensions';

const pass = { passed: true, diff: 0 };
const fail = (diff: number) => ({ passed: false, diff });

describe('Bag Validator', () => {
	describe('Per dimension measurements', () => {
		it('should pass when bag dimensions are exactly equal', () => {
			const dimensions = descDimensions([56, 36, 23]);
			expect(checkCompliance(descDimensions([56, 36, 23]), dimensions)).toEqual([pass, pass, pass]);
		});

		it('should pass when bag dimensions are smaller', () => {
			const dimensions = descDimensions([50, 30, 20]);
			expect(checkCompliance(descDimensions([56, 36, 23]), dimensions)).toEqual([pass, pass, pass]);
		});

		it('should fail when bag dimensions are larger', () => {
			const dimensions = descDimensions([60, 40, 25]);
			expect(checkCompliance(descDimensions([56, 36, 23]), dimensions)).toEqual([
				fail(4),
				fail(4),
				fail(2)
			]);
		});
	});

	describe('Dimension order handling', () => {
		it('should pass regardless of dimension order', () => {
			const dimensions = descDimensions([23, 56, 36]); // Smallest, Largest, Middle
			expect(checkCompliance(descDimensions([56, 36, 23]), dimensions)).toEqual([pass, pass, pass]);
		});

		it('should handle mixed dimension sizes correctly', () => {
			const dimensions = descDimensions([50, 40, 23]); // Smaller, Larger, Equal
			expect(checkCompliance(descDimensions([56, 36, 23]), dimensions)).toEqual([
				pass,
				fail(4),
				pass
			]);
		});
	});

	describe('Total size limit', () => {
		it('should pass when total size is exactly equal', () => {
			const dimensions = descDimensions([50, 40, 25]);
			expect(checkCompliance(115, dimensions)).toEqual([pass]);
		});

		it('should pass when total size is smaller', () => {
			const dimensions = descDimensions([45, 35, 20]);
			expect(checkCompliance(115, dimensions)).toEqual([pass]);
		});

		it('should fail when total size is larger', () => {
			const dimensions = descDimensions([55, 45, 30]);
			expect(checkCompliance(115, dimensions)).toEqual([fail(15)]);
		});
	});

	describe('Flexibility handling', () => {
		describe('Per dimension measurements with per-dimension budgets', () => {
			it('should pass when single dimension exceeds within its budget', () => {
				// Bag is 2cm over in largest dimension, 3cm budget available
				const budgets = descDimensions([3, 3, 3]);
				expect(
					checkCompliance(descDimensions([56, 35, 23]), descDimensions([58, 35, 23]), budgets)
				).toEqual([pass, pass, pass]);
			});

			it('should pass when each dimension exceeds within its own budget', () => {
				// Bag is 1cm over in two dimensions, each has 2cm budget
				const budgets = descDimensions([2, 2, 2]);
				expect(
					checkCompliance(descDimensions([56, 36, 23]), descDimensions([57, 37, 23]), budgets)
				).toEqual([pass, pass, pass]);
			});

			it('should fail when dimension exceeds its own budget', () => {
				// Bag is 2cm over in largest dimension, but only 1cm budget available
				const airlineDims = descDimensions([56, 36, 23]);
				const bagDims = descDimensions([58, 36, 23]);
				const budgets = descDimensions([1, 1, 1]);
				const result = checkCompliance(airlineDims, bagDims, budgets);
				expect(result).toEqual([fail(2), pass, pass]);
			});

			it('should handle per-dimension budgets independently', () => {
				// Largest dimension has 5cm budget (passes), middle has 2cm budget (fails with 3cm excess)
				const budgets = descDimensions([5, 2, 1]);
				expect(
					checkCompliance(descDimensions([56, 36, 23]), descDimensions([59, 39, 23]), budgets)
				).toEqual([pass, fail(3), pass]);
			});

			it('should handle budgets of 0', () => {
				// Bag is 1cm over in one dimension, no budget available
				const budgets = descDimensions([0, 0, 0]);
				expect(
					checkCompliance(descDimensions([56, 36, 23]), descDimensions([57, 36, 23]), budgets)
				).toEqual([fail(1), pass, pass]);
			});
		});

		describe('Total size limit with flexibility', () => {
			it('should pass when total size exceeds within total flexibility', () => {
				// Total size is 1cm over limit, total budget is 2cm
				const budgets = descDimensions([1, 1, 0]);
				expect(checkCompliance(115, descDimensions([50, 40, 26]), budgets)).toEqual([pass]);
			});

			it('should fail when total size exceeds total flexibility', () => {
				// Total size is 3cm over limit, total budget is 2cm
				const budgets = descDimensions([1, 1, 0]);
				expect(checkCompliance(115, descDimensions([50, 40, 28]), budgets)).toEqual([fail(3)]);
			});
		});
	});
});
