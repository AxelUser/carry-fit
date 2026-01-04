import type { UserDimensions, SortedDimensions } from '$lib/types';
import { descDimensions } from '$lib/utils/dimensions';

export const FLEXIBILITY_MIN_FILL_PERCENTAGE = 60;
export const FLEXIBILITY_MAX_FILL_PERCENTAGE = 100;
export const FLEXIBILITY_STEP_PERCENTAGE = 5;

/**
 * Calculates per-dimension flexibility budgets for a soft bag.
 *
 * Each dimension can compress proportionally to its empty space:
 * - Height budget = height * empty_percentage
 * - Width budget = width * empty_percentage
 * - Depth budget = depth * empty_percentage
 *
 * Returns budgets sorted to match user dimensions sorted descendingly.
 *
 * @param userDimensions - User's bag dimensions
 * @param fillPercentage - How full the bag is (0-100%)
 * @returns Sorted descendingly array of flexibility budgets
 */
export function calculateFlexibility(
	userDimensions: UserDimensions,
	fillPercentage: number
): SortedDimensions {
	const { height, width, depth } = userDimensions;
	const emptyPercentage = (100 - fillPercentage) / 100;

	const heightBudget = height * emptyPercentage;
	const widthBudget = width * emptyPercentage;
	const depthBudget = depth * emptyPercentage;

	return descDimensions([heightBudget, widthBudget, depthBudget]);
}
