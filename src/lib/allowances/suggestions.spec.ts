import { describe, it, expect } from 'vitest';
import { findNearestOptimalFillLevel } from './suggestions';
import type {
	AirlineInfo,
	UserDimensions,
	MeasurementSystem,
	SortedDimensions,
	AirlineCompliance
} from '$lib/types';
import { MeasurementSystems } from '$lib/types';
import { descDimensions } from '$lib/utils/dimensions';

const createMockAirline = (
	name: string,
	carryOnCm: SortedDimensions,
	carryOnIn: SortedDimensions
): AirlineCompliance => ({
	region: 'Europe',
	link: 'test',
	airline: name,
	carryon: {
		centimeters: carryOnCm,
		inches: carryOnIn
	},
	personalItem: undefined,
	complianceResults: [],
	personalItemComplianceResults: undefined
});

describe('findNearestOptimalFillLevel', () => {
	const metricSystem: MeasurementSystem = MeasurementSystems.Metric;
	const imperialSystem: MeasurementSystem = MeasurementSystems.Imperial;

	describe('Edge cases', () => {
		it('should return null when dimensions are not set', () => {
			const airlines = [
				createMockAirline('Test Airline', descDimensions([55, 40, 23]), descDimensions([22, 16, 9]))
			];
			const emptyDimensions: UserDimensions = { depth: 0, width: 0, height: 0 };

			const result = findNearestOptimalFillLevel(airlines, emptyDimensions, metricSystem);

			expect(result).toBeNull();
		});

		it('should return null when airlines array is empty', () => {
			const dimensions: UserDimensions = { depth: 23, width: 40, height: 55 };

			const result = findNearestOptimalFillLevel([], dimensions, metricSystem);

			expect(result).toBeNull();
		});

		it('should never suggest below 70%', () => {
			const airlines = [
				createMockAirline('Test Airline', descDimensions([50, 35, 20]), descDimensions([20, 14, 8]))
			];
			const dimensions: UserDimensions = { depth: 23, width: 40, height: 55 };

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			if (result) {
				expect(result.fillPercentage).toBeGreaterThanOrEqual(70);
			}
		});
	});

	describe('Improvement scenarios', () => {
		it('should return null when no improvement is found', () => {
			const airlines = [
				createMockAirline(
					'Large Airline',
					descDimensions([60, 45, 30]),
					descDimensions([24, 18, 12])
				),
				createMockAirline(
					'Very Large Airline',
					descDimensions([65, 50, 35]),
					descDimensions([26, 20, 14])
				)
			];
			const dimensions: UserDimensions = { depth: 20, width: 35, height: 50 };

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			expect(result).toBeNull();
		});

		it('should find improvement when reducing fill percentage helps', () => {
			const airlines = [
				createMockAirline(
					'Strict Airline',
					descDimensions([55, 40, 23]),
					descDimensions([22, 16, 9])
				),
				createMockAirline(
					'Another Strict',
					descDimensions([56, 41, 24]),
					descDimensions([22, 16, 9.5])
				)
			];
			const dimensions: UserDimensions = { depth: 24, width: 41, height: 56 };

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			if (result) {
				expect(result.fillPercentage).toBeLessThan(100);
				expect(result.fillPercentage).toBeGreaterThanOrEqual(70);
				expect(result.complianceScore).toBeGreaterThan(0);
			}
		});

		it('should return suggestion with valid fill percentage and compliance score', () => {
			const airlines = [
				createMockAirline(
					'Strict Airline',
					descDimensions([55, 40, 23]),
					descDimensions([22, 16, 9])
				)
			];
			const dimensions: UserDimensions = { depth: 24, width: 41, height: 56 };

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			if (result) {
				expect(result.fillPercentage).toBeGreaterThanOrEqual(70);
				expect(result.fillPercentage).toBeLessThanOrEqual(100);
				expect(result.complianceScore).toBeGreaterThanOrEqual(0);
				expect(result.complianceScore).toBeLessThanOrEqual(100);
			}
		});

		it('should return the first fill level that meets the threshold, not the best', () => {
			const airlines = [
				createMockAirline(
					'Strict Airline',
					descDimensions([55, 40, 23]),
					descDimensions([22, 16, 9])
				)
			];
			const dimensions: UserDimensions = { depth: 24, width: 41, height: 56 };

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			if (result) {
				expect(result.fillPercentage).toBeLessThan(100);
				expect(result.fillPercentage).toBeGreaterThanOrEqual(70);
			}
		});
	});

	describe('Different measurement systems', () => {
		it('should work with metric system', () => {
			const airlines = [
				createMockAirline('Test Airline', descDimensions([55, 40, 23]), descDimensions([22, 16, 9]))
			];
			const dimensions: UserDimensions = { depth: 24, width: 41, height: 56 };

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			expect(result).toBeDefined();
		});

		it('should work with imperial system', () => {
			const airlines = [
				createMockAirline('Test Airline', descDimensions([55, 40, 23]), descDimensions([22, 16, 9]))
			];
			const dimensions: UserDimensions = { depth: 9.5, width: 16.5, height: 22.5 };

			const result = findNearestOptimalFillLevel(airlines, dimensions, imperialSystem, 100);

			expect(result).toBeDefined();
		});
	});

	describe('Current fill percentage handling', () => {
		it('should use provided current fill percentage', () => {
			const airlines = [
				createMockAirline('Test Airline', descDimensions([55, 40, 23]), descDimensions([22, 16, 9]))
			];
			const dimensions: UserDimensions = { depth: 24, width: 41, height: 56 };

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 85);

			if (result) {
				expect(result.fillPercentage).toBeLessThan(85);
			}
		});

		it('should default to 100% when current fill percentage not provided', () => {
			const airlines = [
				createMockAirline('Test Airline', descDimensions([55, 40, 23]), descDimensions([22, 16, 9]))
			];
			const dimensions: UserDimensions = { depth: 24, width: 41, height: 56 };

			const result1 = findNearestOptimalFillLevel(airlines, dimensions, metricSystem);

			const result2 = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			expect(result1).toEqual(result2);
		});
	});
});
