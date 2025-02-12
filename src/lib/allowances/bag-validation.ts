import type {
	UserDimensions,
	MeasurementSystem,
	AirlinesByCompliance,
	AirlineInfo,
	AirlineCompliance
} from '$lib/types';
import { getAirlineDimensions } from '$lib/utils/mapping';

/**
 * Check if the user's bag dimensions comply with the airline's carry-on limits.
 * Takes into account potential flexibility of soft bags.
 * @param airlineDimensions - The airline's carry-on limits. Can be size per dimension or total size.
 * @param userDimensions - The user's bag dimensions.
 * @param flexibility - Amount of flexibility in the same unit as dimensions
 * @returns An object containing the compliance status for each dimension, or a boolean if the airline has a total size limit. If user dimensions contain 0, returns null.
 */
export function checkCompliance(
	airlineDimensions: number[],
	userDimensions: number[],
	flexibility: number = 0
): boolean[] | null {
	if (airlineDimensions.length === 0 || userDimensions.length === 0) return null;

	if (airlineDimensions.length === 1) {
		const bagSum = userDimensions.reduce((acc, curr) => acc + curr, 0);
		return [bagSum <= airlineDimensions[0] + flexibility];
	}

	// Sort dimensions from largest to smallest for both airline and bag
	const bagDims = userDimensions.toSorted((a, b) => b - a);
	const airlineDims = airlineDimensions.toSorted((a, b) => b - a);

	let remainingFlexibility = flexibility;

	return airlineDims.map((airlineDim, index) => {
		const bagDim = bagDims[index];
		const excess = bagDim - airlineDim;

		// If dimension fits or we have no excess, it's compliant
		if (excess <= 0) return true;

		// If we have enough flexibility to accommodate the excess
		if (excess <= remainingFlexibility) {
			remainingFlexibility -= excess;
			return true;
		}

		return false;
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

			if (compliance?.every(Boolean)) {
				acc.compliant.push({ ...airline, complianceResults: compliance });
			} else if (compliance) {
				acc.nonCompliant.push({ ...airline, complianceResults: compliance });
			}

			return acc;
		},
		{ compliant: [], nonCompliant: [] }
	);
}
