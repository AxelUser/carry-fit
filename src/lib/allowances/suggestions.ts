import type { UserDimensions, MeasurementSystem, AirlineCompliance } from '$lib/types';
import { computeAirlinesCompliance, calculateComplianceScore } from './bag-validation';
import {
	calculateFlexibility,
	FLEXIBILITY_MIN_FILL_PERCENTAGE,
	FLEXIBILITY_STEP_PERCENTAGE
} from './flexibility';

export interface FillSuggestion {
	fillPercentage: number;
	complianceScore: number;
}

const IMPROVEMENT_THRESHOLD = 10;

/**
 * Finds the nearest optimal fill percentage for a soft bag that improves airline compliance.
 *
 * The algorithm steps down from the current fill percentage in {@link FLEXIBILITY_STEP_PERCENTAGE}, e.g. 5%, increments,
 * calculating per-dimension flexibility budgets for each fill level and evaluating
 * compliance scores. It returns the nearest fill level that provides a significant
 * improvement (at least {@link IMPROVEMENT_THRESHOLD}, e.g. 10, points) over the baseline.
 *
 * The compliance score represents the percentage of airlines that the bag would
 * be compliant with at that fill level. A higher score means more airlines accept
 * the bag dimensions.
 *
 * The algorithm respects a minimum fill level of {@link FLEXIBILITY_MIN_FILL_PERCENTAGE}, e.g. 70%, to ensure the suggestion
 * don't go crazy and unrealistically low.
 *
 * @param baselineCompliance - Array of airline compliance data to evaluate against
 * @param userDimensions - The user's bag dimensions
 * @param measurementSystem - The measurement system to use for the calculations
 * @param currentFillPercentage - Current fill percentage (default: 100%, meaning fully packed)
 * @returns A suggestion object with the nearest fill percentage that meets the improvement threshold and its compliance score,
 * or null if no significant improvement is found or inputs are invalid
 */
export function findNearestOptimalFillLevel(
	baselineCompliance: AirlineCompliance[],
	userDimensions: UserDimensions,
	measurementSystem: MeasurementSystem,
	currentFillPercentage: number = 100
): FillSuggestion | null {
	if (
		userDimensions.depth === 0 ||
		userDimensions.width === 0 ||
		userDimensions.height === 0 ||
		baselineCompliance.length === 0
	) {
		return null;
	}

	const baselineScore = calculateComplianceScore(baselineCompliance);

	for (
		let fill = currentFillPercentage;
		fill >= FLEXIBILITY_MIN_FILL_PERCENTAGE;
		fill -= FLEXIBILITY_STEP_PERCENTAGE
	) {
		if (fill === currentFillPercentage) continue;

		const budgets = calculateFlexibility(userDimensions, fill);
		const compliance = computeAirlinesCompliance(
			baselineCompliance,
			userDimensions,
			measurementSystem,
			budgets
		);
		const score = calculateComplianceScore(compliance);

		const improvement = score - baselineScore;

		if (improvement >= IMPROVEMENT_THRESHOLD) {
			return {
				fillPercentage: fill,
				complianceScore: score
			};
		}
	}

	return null;
}
