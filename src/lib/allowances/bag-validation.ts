import type {
	UserDimensions,
	MeasurementSystem,
	AirlinesByCompliance,
	AirlineInfo,
	AirlineCompliance,
	DimensionCompliance,
	BagAllowance,
	DimensionValue
} from '$lib/types';
import { descDimensions, getRelevantAirlineDimensions } from '$lib/utils/dimensions';
import { DEFAULT_PERSONAL_ITEM } from './index';
import type { SortedDimensions } from '$lib/types';

function hasDimensions(allowance?: BagAllowance | null): allowance is BagAllowance {
	const dims = allowance?.inches ?? allowance?.centimeters;
	if (Array.isArray(dims)) return dims.length > 0;
	return typeof dims === 'number';
}

/**
 * Check if the user's bag dimensions comply with the airline's carry-on limits.
 * Takes into account potential flexibility of soft bags.
 * @param airlineDimensions - The airline's carry-on limits. Can be size per dimension or total size.
 * @param userDimensions - The user's bag dimensions.
 * @param flexibilityBudgets - Per-dimension flexibility budgets in the same unit as dimensions
 * @returns An array of compliance results with pass/fail status and diff for each dimension. Returns null if dimensions are empty.
 */
export function checkCompliance(
	airlineDimensions: DimensionValue,
	userDimensions: SortedDimensions,
	flexibilityBudgets?: SortedDimensions
): DimensionCompliance[] | undefined {
	if (typeof airlineDimensions === 'number') {
		const totalFlexibility = flexibilityBudgets?.reduce((acc, curr) => acc + curr, 0) ?? 0;
		const bagSum = userDimensions.reduce((acc, curr) => acc + curr, 0);
		const diff = bagSum - airlineDimensions;
		const passed = diff <= totalFlexibility;
		return [{ passed, diff: passed ? 0 : diff }];
	}

	return airlineDimensions.map((airlineDim, index) => {
		const bagDim = userDimensions[index];
		const excess = bagDim - airlineDim;
		const budget = flexibilityBudgets?.[index] ?? 0;

		if (excess <= 0) {
			return { passed: true, diff: 0 };
		}

		if (excess <= budget) {
			return { passed: true, diff: 0 };
		}

		return { passed: false, diff: excess };
	});
}

export function computeAirlinesCompliance(
	airlines: AirlineInfo[],
	userDimensions: UserDimensions,
	measurementSystem: MeasurementSystem,
	flexibilityBudgets: SortedDimensions
): AirlineCompliance[] {
	if (userDimensions.depth === 0 || userDimensions.width === 0 || userDimensions.height === 0) {
		return [];
	}

	const userDimensionsSorted = descDimensions([
		userDimensions.depth,
		userDimensions.width,
		userDimensions.height
	]);

	return airlines.map((airline) => {
		const carryOnDimensions = getRelevantAirlineDimensions(airline.carryon, measurementSystem);
		if (!carryOnDimensions) {
			throw new Error(
				`No carry-on dimensions provided in ${airline.airline} for measurement system ${measurementSystem}`
			);
		}

		const compliance = checkCompliance(carryOnDimensions, userDimensionsSorted, flexibilityBudgets);

		const personalItemDimensions = getRelevantAirlineDimensions(
			hasDimensions(airline.personalItem) ? airline.personalItem : DEFAULT_PERSONAL_ITEM,
			measurementSystem
		);
		if (!personalItemDimensions) {
			throw new Error(
				`No personal item dimensions provided in ${airline.airline} for measurement system ${measurementSystem}`
			);
		}

		const personalItemCompliance = checkCompliance(
			personalItemDimensions,
			userDimensionsSorted,
			flexibilityBudgets
		);

		return {
			...airline,
			complianceResults: compliance || [],
			personalItemComplianceResults: personalItemCompliance
		};
	});
}

export function calculateComplianceScore(airlines: AirlineCompliance[]): number {
	if (airlines.length === 0) return 0;
	const compliantCount = airlines.reduce((count, airline) => {
		return count + (airline.complianceResults.every((result) => result.passed) ? 1 : 0);
	}, 0);
	return (compliantCount / airlines.length) * 100;
}
