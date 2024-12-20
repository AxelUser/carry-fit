import { describe, it, expect } from 'vitest';
import { checkCompliance } from '$lib/allowances';
import type { Airline, UserDimensions } from '$lib/types';

describe('Bag Validator', () => {
	const testAirline: Airline = {
		airline: 'Test Airline',
		region: 'Test Region',
		inches: [22, 14, 9],
		centimeters: [56, 36, 23],
	};

	it('should return null when dimensions are missing', () => {
		const dimensions: UserDimensions = {
			length: 0,
			width: 10,
			height: 10,
			unit: 'cm'
		};
		expect(checkCompliance(testAirline, dimensions)).toBeNull();
	});

	describe('Centimeter measurements', () => {
		it('should pass when bag dimensions are exactly equal', () => {
			const dimensions: UserDimensions = {
				length: 56,
				width: 36,
				height: 23,
				unit: 'cm'
			};
			expect(checkCompliance(testAirline, dimensions)).toEqual({
				length: true,
				width: true,
				height: true
			});
		});

		it('should pass when bag dimensions are smaller', () => {
			const dimensions: UserDimensions = {
				length: 50,
				width: 30,
				height: 20,
				unit: 'cm'
			};
			expect(checkCompliance(testAirline, dimensions)).toEqual({
				length: true,
				width: true,
				height: true
			});
		});

		it('should fail when bag dimensions are larger', () => {
			const dimensions: UserDimensions = {
				length: 60,
				width: 40,
				height: 25,
				unit: 'cm'
			};
			expect(checkCompliance(testAirline, dimensions)).toEqual({
				length: false,
				width: false,
				height: false
			});
		});
	});

	describe('Inch measurements', () => {
		it('should pass when bag dimensions are exactly equal', () => {
			const dimensions: UserDimensions = {
				length: 22,
				width: 14,
				height: 9,
				unit: 'in'
			};
			expect(checkCompliance(testAirline, dimensions)).toEqual({
				length: true,
				width: true,
				height: true
			});
		});

		it('should pass when bag dimensions are smaller', () => {
			const dimensions: UserDimensions = {
				length: 20,
				width: 12,
				height: 8,
				unit: 'in'
			};
			expect(checkCompliance(testAirline, dimensions)).toEqual({
				length: true,
				width: true,
				height: true
			});
		});

		it('should fail when bag dimensions are larger', () => {
			const dimensions: UserDimensions = {
				length: 24,
				width: 16,
				height: 10,
				unit: 'in'
			};
			expect(checkCompliance(testAirline, dimensions)).toEqual({
				length: false,
				width: false,
				height: false
			});
		});
	});

	describe('Dimension order handling', () => {
		it('should pass regardless of dimension order', () => {
			const dimensions: UserDimensions = {
				length: 23,  // Smallest
				width: 56,   // Largest
				height: 36,  // Middle
				unit: 'cm'
			};
			expect(checkCompliance(testAirline, dimensions)).toEqual({
				length: true,
				width: true,
				height: true
			});
		});

		it('should handle mixed dimension sizes correctly', () => {
			const dimensions: UserDimensions = {
				length: 50,   // Smaller than max
				width: 40,    // Larger than max
				height: 23,   // Equal to max
				unit: 'cm'
			};
			expect(checkCompliance(testAirline, dimensions)).toEqual({
				length: true,
				width: false,
				height: true
			});
		});
	});
});
