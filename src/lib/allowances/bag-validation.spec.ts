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
		describe('Per dimension measurements with flexibility', () => {
			it('should pass when single dimension exceeds within flexibility', () => {
				// 2cm over in one dimension
				expect(
					checkCompliance(descDimensions([56, 35, 23]), descDimensions([58, 35, 23]), 3)
				).toEqual([pass, pass, pass]);
			});

			it('should pass when multiple dimensions exceed within total flexibility', () => {
				// 1cm over in two dimensions (2cm total)
				expect(
					checkCompliance(descDimensions([56, 36, 23]), descDimensions([57, 37, 23]), 3)
				).toEqual([pass, pass, pass]);
			});

			it('should fail for one dimension exceeding total flexibility', () => {
				// 2cm + 2cm + 1cm = 5cm total over, flexibility consumed by first dim
				expect(
					checkCompliance(descDimensions([56, 36, 23]), descDimensions([58, 38, 24]), 3)
				).toEqual([pass, fail(2), pass]);
			});

			it('should handle flexibility of 0', () => {
				// 1cm over in one dimension
				expect(
					checkCompliance(descDimensions([56, 36, 23]), descDimensions([57, 36, 23]), 0)
				).toEqual([fail(1), pass, pass]);
			});
		});

		describe('Total size limit with flexibility', () => {
			it('should pass when total size exceeds within flexibility', () => {
				// 116 total, 1 over
				expect(checkCompliance(115, descDimensions([50, 40, 26]), 2)).toEqual([pass]);
			});

			it('should fail when total size exceeds flexibility', () => {
				// 118 total, 3 over
				expect(checkCompliance(115, descDimensions([50, 40, 28]), 2)).toEqual([fail(3)]);
			});
		});
	});
});
