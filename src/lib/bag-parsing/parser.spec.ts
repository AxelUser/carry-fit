import { describe, it, expect } from 'vitest';
import { DimensionParser } from './parser';
import { convertDimensions } from '$lib/utils/math';

describe('DimensionParser', () => {
	const parser = new DimensionParser();

	describe('parse', () => {
		it('should parse dimensions with both cm and inches', () => {
			const text = '34.0 x 53.0 x 19.0 cm / 13.39 x 20.87 x 7.48in';

			const metricResult = parser.parse(text, 'metric');
			expect(metricResult).toEqual({
				width: 34.0,
				height: 53.0,
				depth: 19.0
			});

			const imperialResult = parser.parse(text, 'imperial');
			expect(imperialResult).toEqual({
				width: 13.39,
				height: 20.87,
				depth: 7.48
			});
		});

		it('should parse dimensions with H/W/D format', () => {
			const text = '7.48H X 10.24W X 15.75D IN.';

			const imperialResult = parser.parse(text, 'imperial');
			expect(imperialResult).toEqual({
				height: 7.48,
				width: 10.24,
				depth: 15.75
			});

			const metricResult = parser.parse(text, 'metric');
			expect(metricResult).toEqual(
				convertDimensions(
					{
						height: 7.48,
						width: 10.24,
						depth: 15.75
					},
					'metric'
				)
			);
		});

		it('should parse dimensions with mixed units and parentheses', () => {
			const text = `Dimensions
				Length: 21.5" (54.5 cm)
				Width: 13" (33 cm)
				Depth: 9" (23 cm)`;

			const imperialResult = parser.parse(text, 'imperial');
			expect(imperialResult).toEqual({
				height: 21.5,
				width: 13,
				depth: 9
			});

			const metricResult = parser.parse(text, 'metric');
			expect(metricResult).toEqual({
				height: 54.5,
				width: 33,
				depth: 23
			});
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
			expect(result).toEqual({
				width: 34.0,
				height: 53.0,
				depth: 19.0
			});
		});

		it('should convert units when only one system is provided', () => {
			const text = '20 x 30 x 40 cm';

			const metricResult = parser.parse(text, 'metric');
			expect(metricResult).toEqual({
				width: 20,
				height: 30,
				depth: 40
			});

			const imperialResult = parser.parse(text, 'imperial');
			expect(imperialResult).toEqual(
				convertDimensions(
					{
						width: 20,
						height: 30,
						depth: 40
					},
					'imperial'
				)
			);
		});
	});
});
