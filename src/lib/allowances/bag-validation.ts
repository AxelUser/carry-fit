import type {
	UserDimensions,
	MeasurementSystem,
	AirlinesByCompliance,
	AirlineInfo,
	AirlineCompliance,
	DimensionCompliance,
	BagAllowance
} from '$lib/types';
import { getAirlineDimensions } from '$lib/utils/mapping';
import { DEFAULT_PERSONAL_ITEM } from './index';

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
 * @param flexibility - Amount of flexibility in the same unit as dimensions
 * @returns An array of compliance results with pass/fail status and diff for each dimension. Returns null if dimensions are empty.
 */
export function checkCompliance(
	airlineDimensions: number[],
	userDimensions: number[],
	flexibility: number = 0
): DimensionCompliance[] | null {
	if (airlineDimensions.length === 0 || userDimensions.length === 0) return null;

	if (airlineDimensions.length === 1) {
		const bagSum = userDimensions.reduce((acc, curr) => acc + curr, 0);
		const diff = bagSum - airlineDimensions[0];
		const passed = diff <= flexibility;
		return [{ passed, diff: passed ? 0 : diff }];
	}

	// Sort dimensions from largest to smallest for both airline and bag
	const bagDims = userDimensions.toSorted((a, b) => b - a);
	const airlineDims = airlineDimensions.toSorted((a, b) => b - a);

	let remainingFlexibility = flexibility;

	return airlineDims.map((airlineDim, index) => {
		const bagDim = bagDims[index];
		const excess = bagDim - airlineDim;

		// If dimension fits or we have no excess, it's compliant
		if (excess <= 0) {
			return { passed: true, diff: 0 };
		}

		// If we have enough flexibility to accommodate the excess
		if (excess <= remainingFlexibility) {
			remainingFlexibility -= excess;
			return { passed: true, diff: 0 };
		}

		return { passed: false, diff: excess };
	});
}

export function groupAirlinesByCompliance(
	airlines: AirlineInfo[],
	userDimensions: UserDimensions,
	measurementSystem: MeasurementSystem,
	flexibility: number
): AirlinesByCompliance {
	if (userDimensions.depth === 0 || userDimensions.width === 0 || userDimensions.height === 0) {
		return {
			compliant: [],
			nonCompliant: []
		};
	}

	return airlines.reduce<{
		compliant: AirlineCompliance[];
		nonCompliant: AirlineCompliance[];
	}>(
		(acc, airline) => {
			const compliance = checkCompliance(
				getAirlineDimensions(airline.carryon, measurementSystem),
				[userDimensions.depth, userDimensions.width, userDimensions.height],
				flexibility
			);

			const personalItemDimensions = getAirlineDimensions(
				hasDimensions(airline.personalItem) ? airline.personalItem : DEFAULT_PERSONAL_ITEM,
				measurementSystem
			);

			const personalItemCompliance = checkCompliance(
				personalItemDimensions,
				[userDimensions.depth, userDimensions.width, userDimensions.height],
				flexibility
			);

			const airlineCompliance: AirlineCompliance = {
				...airline,
				complianceResults: compliance || [],
				personalItemComplianceResults: personalItemCompliance
			};

			if (compliance?.every((c) => c.passed)) {
				acc.compliant.push(airlineCompliance);
			} else if (compliance) {
				acc.nonCompliant.push(airlineCompliance);
			}

			return acc;
		},
		{ compliant: [], nonCompliant: [] }
	);
}
