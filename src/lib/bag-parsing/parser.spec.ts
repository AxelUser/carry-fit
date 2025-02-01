import { describe, it, expect } from 'vitest';
import { DimensionParser } from './parser';
import { convertDimensions } from '$lib/utils/math';
import type { UserDimensions } from '$lib/types';

describe('DimensionParser', () => {
	const parser = new DimensionParser();

	describe('parse', () => {
		it('should parse dimensions with both cm and inches', () => {
			const text = '34.0 x 53.0 x 19.0 cm / 13.39 x 20.87 x 7.48in';

			const metricResult = parser.parse(text, 'metric');
			expect(convertToDescArray(metricResult)).toEqual([53, 34, 19]);

			const imperialResult = parser.parse(text, 'imperial');
			expect(convertToDescArray(imperialResult)).toEqual([20.87, 13.39, 7.48]);
		});

		it('should parse dimensions with H/W/D format', () => {
			const text = '7.48H X 10.24W X 15.75D IN.';

			const imperialResult = parser.parse(text, 'imperial');
			expect(convertToDescArray(imperialResult)).toEqual([15.75, 10.24, 7.48]);

			const metricResult = parser.parse(text, 'metric');
			expect(convertToDescArray(metricResult)).toEqual(
				convertDimensions([15.75, 10.24, 7.48], 'metric')
			);
		});

		it('should parse dimensions with mixed units and parentheses', () => {
			const text = `Dimensions
				Length: 21.5" (54.5 cm)
				Width: 13" (33 cm)
				Depth: 9" (23 cm)`;

			const imperialResult = parser.parse(text, 'imperial');
			expect(convertToDescArray(imperialResult)).toEqual([21.5, 13, 9]);

			const metricResult = parser.parse(text, 'metric');
			expect(convertToDescArray(metricResult)).toEqual([54.5, 33, 23]);
		});

		it('should handle invalid input', () => {
			expect(parser.parse('no numbers here', 'metric')).toBeNull();
			expect(parser.parse('1 x 2', 'metric')).toBeNull(); // Not enough numbers
			expect(parser.parse('', 'metric')).toBeNull();
		});

		it('should handle messy text with dimensions', () => {
			const text = `
				Product Details
				Some random text here
				Dimensions: 34.0 x 53.0 x 19.0 cm
				More product details
				Colors available: black, blue
			`;

			const result = parser.parse(text, 'metric');
			expect(convertToDescArray(result)).toEqual([53.0, 34.0, 19.0]);
		});

		it('should convert units when only one system is provided', () => {
			const text = '20 x 30 x 40 cm';

			const metricResult = parser.parse(text, 'metric');
			expect(convertToDescArray(metricResult)).toEqual([40, 30, 20]);

			const imperialResult = parser.parse(text, 'imperial');
			const expectedImperial = convertDimensions([40, 30, 20], 'imperial');
			expect(convertToDescArray(imperialResult)).toEqual(expectedImperial);
		});
	});
});

function convertToDescArray(dims: UserDimensions | null): number[] | null {
	if (!dims) return null;

	return [dims.depth, dims.height, dims.width].toSorted((a, b) => b - a);
}
