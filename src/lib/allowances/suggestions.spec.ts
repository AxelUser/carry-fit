import { describe, it, expect } from 'vitest';
import { findNearestOptimalFillLevel } from './suggestions';
import type {
	UserDimensions,
	MeasurementSystem,
	SortedDimensions,
	AirlineCompliance
} from '$lib/types';
import { MeasurementSystems } from '$lib/types';
import { descDimensions } from '$lib/utils/dimensions';
import { FLEXIBILITY_MIN_FILL_PERCENTAGE } from './flexibility';
import { checkCompliance } from './bag-validation';

const createMockAirline = (
	name: string,
	carryOnCm: SortedDimensions,
	carryOnIn: SortedDimensions,
	userDimensions: UserDimensions,
	measurementSystem: MeasurementSystem
): AirlineCompliance => {
	const userDimensionsSorted = descDimensions([
		userDimensions.depth,
		userDimensions.width,
		userDimensions.height
	]);

	const relevantDimensions =
		measurementSystem === MeasurementSystems.Metric ? carryOnCm : carryOnIn;
	const compliance = checkCompliance(relevantDimensions, userDimensionsSorted); // No flexibility

	return {
		region: 'Europe',
		link: 'test',
		airline: name,
		carryon: {
			centimeters: carryOnCm,
			inches: carryOnIn
		},
		personalItem: undefined,
		complianceResults: compliance || [],
		personalItemComplianceResults: undefined
	};
};

/**
 * Creates airlines that will be strategically compliant or non-compliant
 * based on bag dimensions.
 *
 * @param bagDimensions - The bag dimensions (unsorted)
 * @param nonCompliantCount - Number of airlines that should be non-compliant at 100% fill
 * @param compliantCount - Number of airlines that should be compliant even at 100% fill
 * @param measurementSystem - The measurement system to use
 * @returns Array of airlines where some will be non-compliant at 100% fill
 *          but become compliant when fill percentage is reduced
 */
function createAirlinesForImprovement(
	bagDimensions: UserDimensions,
	nonCompliantCount: number,
	compliantCount: number,
	measurementSystem: MeasurementSystem
): AirlineCompliance[] {
	const bagSorted = descDimensions([
		bagDimensions.height,
		bagDimensions.width,
		bagDimensions.depth
	]);

	const isMetric = measurementSystem === MeasurementSystems.Metric;
	const cmToIn = (cm: number) => cm / 2.54;
	const inToCm = (inches: number) => inches * 2.54;

	// Helper to create airline limits
	const createLimits = (baseLimits: SortedDimensions) => ({
		cm: isMetric ? baseLimits : descDimensions(baseLimits.map(inToCm) as [number, number, number]),
		in: isMetric ? descDimensions(baseLimits.map(cmToIn) as [number, number, number]) : baseLimits
	});

	// Non-compliant airlines: limits slightly smaller than bag dimensions
	// (non-compliant at 100% fill, compliant with any flexibility)
	const nonCompliantAirlines = Array.from({ length: nonCompliantCount }, (_, i) => {
		const tightLimits = bagSorted.map((dim) => dim * 0.99); // 1% smaller
		const limits = createLimits(descDimensions(tightLimits as [number, number, number]));
		return createMockAirline(
			`Non-Compliant ${i + 1}`,
			limits.cm,
			limits.in,
			bagDimensions,
			measurementSystem
		);
	});

	// Compliant airlines: limits 10% larger than bag dimensions
	// (always compliant, even at 100% fill)
	const compliantAirlines = Array.from({ length: compliantCount }, (_, i) => {
		const oversizedLimits = bagSorted.map((dim) => dim * 1.1);
		const limits = createLimits(descDimensions(oversizedLimits as [number, number, number]));
		return createMockAirline(
			`Compliant ${i + 1}`,
			limits.cm,
			limits.in,
			bagDimensions,
			measurementSystem
		);
	});

	return [...nonCompliantAirlines, ...compliantAirlines];
}

describe('findNearestOptimalFillLevel', () => {
	const metricSystem: MeasurementSystem = MeasurementSystems.Metric;
	const imperialSystem: MeasurementSystem = MeasurementSystems.Imperial;

	describe('Edge cases', () => {
		it('should return null when dimensions are not set', () => {
			const emptyDimensions: UserDimensions = { depth: 0, width: 0, height: 0 };
			const airlines = [
				createMockAirline(
					'Test Airline',
					descDimensions([55, 40, 23]),
					descDimensions([22, 16, 9]),
					emptyDimensions,
					metricSystem
				)
			];

			const result = findNearestOptimalFillLevel(airlines, emptyDimensions, metricSystem);

			expect(result).toBeNull();
		});

		it('should return null when airlines array is empty', () => {
			const dimensions: UserDimensions = { depth: 23, width: 40, height: 55 };

			const result = findNearestOptimalFillLevel([], dimensions, metricSystem);

			expect(result).toBeNull();
		});

		it('should never suggest below minimum fill percentage', () => {
			const dimensions: UserDimensions = { depth: 20.5, width: 35.5, height: 50.5 };
			const airlines = createAirlinesForImprovement(dimensions, 95, 2, metricSystem);

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			expect(result).toBeTruthy();
			expect(result?.fillPercentage).toBeGreaterThanOrEqual(FLEXIBILITY_MIN_FILL_PERCENTAGE);
		});
	});

	describe('Improvement scenarios', () => {
		it('should return null when no improvement is found', () => {
			const dimensions: UserDimensions = { depth: 20, width: 35, height: 50 };
			const airlines = [
				createMockAirline(
					'Large Airline',
					descDimensions([60, 45, 30]),
					descDimensions([24, 18, 12]),
					dimensions,
					metricSystem
				),
				createMockAirline(
					'Very Large Airline',
					descDimensions([65, 50, 35]),
					descDimensions([26, 20, 14]),
					dimensions,
					metricSystem
				)
			];

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			expect(result).toBeNull();
		});

		it('should find improvement when reducing fill percentage helps', () => {
			const dimensions: UserDimensions = { depth: 23.5, width: 40.5, height: 55.5 };
			const airlines = createAirlinesForImprovement(dimensions, 95, 2, metricSystem);

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			expect(result).toBeTruthy();
			expect(result?.fillPercentage).toBeLessThan(100);
			expect(result?.fillPercentage).toBeGreaterThanOrEqual(60);
			expect(result?.complianceScore).toBeGreaterThan(0);
		});

		it('should return suggestion with valid fill percentage and compliance score', () => {
			const dimensions: UserDimensions = { depth: 23.5, width: 40.5, height: 55.5 };
			const airlines = createAirlinesForImprovement(dimensions, 95, 2, metricSystem);

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			expect(result).toBeTruthy();
			expect(result?.fillPercentage).toBeGreaterThanOrEqual(60);
			expect(result?.fillPercentage).toBeLessThanOrEqual(100);
			expect(result?.complianceScore).toBeGreaterThanOrEqual(0);
			expect(result?.complianceScore).toBeLessThanOrEqual(100);
		});

		it('should return the first fill level that meets the threshold, not the best', () => {
			const dimensions: UserDimensions = { depth: 23.5, width: 40.5, height: 55.5 };
			const airlines = createAirlinesForImprovement(dimensions, 95, 2, metricSystem);

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			expect(result).toBeTruthy();
			expect(result!.fillPercentage).toBeLessThan(100);
			expect(result!.fillPercentage).toBeGreaterThanOrEqual(60);
		});
	});

	describe('Different measurement systems', () => {
		it('should work with metric system', () => {
			const dimensions: UserDimensions = { depth: 23.5, width: 40.5, height: 55.5 };
			const airlines = createAirlinesForImprovement(dimensions, 95, 2, metricSystem);

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			expect(result).toBeTruthy();
		});

		it('should work with imperial system', () => {
			const dimensions: UserDimensions = { depth: 9.25, width: 16, height: 22 };
			const airlines = createAirlinesForImprovement(dimensions, 95, 2, imperialSystem);

			const result = findNearestOptimalFillLevel(airlines, dimensions, imperialSystem, 100);

			expect(result).toBeTruthy();
		});
	});

	describe('Current fill percentage handling', () => {
		it('should use provided current fill percentage', () => {
			const dimensions: UserDimensions = { depth: 23.5, width: 40.5, height: 55.5 };
			const airlines = createAirlinesForImprovement(dimensions, 80, 2, metricSystem);

			const result = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 85);

			expect(result).toBeTruthy();
			expect(result?.fillPercentage).toBeLessThan(85);
		});

		it('should default to 100% when current fill percentage not provided', () => {
			const dimensions: UserDimensions = { depth: 23.5, width: 40.5, height: 55.5 };
			const airlines = createAirlinesForImprovement(dimensions, 95, 2, metricSystem);

			const result1 = findNearestOptimalFillLevel(airlines, dimensions, metricSystem);

			const result2 = findNearestOptimalFillLevel(airlines, dimensions, metricSystem, 100);

			expect(result1).toBeTruthy();
			expect(result2).toBeTruthy();
			expect(result1).toEqual(result2);
		});
	});
});
