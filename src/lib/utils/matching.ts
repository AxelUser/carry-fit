const WEIGHTS = {
	BASE: 1,
	CONSECUTIVE: 5,
	WORD_BOUNDARY: 10,
	SKIPPED: 0.5
};

/**
 * Computes an opinionated similarity score between a query and target string.
 * Optimized for autocomplete and search scenarios where matches at word boundaries
 * and consecutive characters are considered more relevant.
 *
 * @param query - The search term to look for
 * @param target - The string to search within
 * @returns A normalized score between 0 and 1, where:
 * - 1.0: Perfect match (all characters match at word boundaries)
 * - 0.0: No match (characters not found or wrong order)
 * - Values between indicate partial matches, weighted by:
 *   1. Word boundary matches (10 points): Characters matching at start of words
 *   2. Consecutive matches (5 points): Characters matching in sequence
 *   3. Regular matches (1 point): Characters matching with gaps
 *
 * The scoring is opinionated and optimized for:
 * - Autocomplete scenarios where prefix matches are important
 * - Search where word boundary matches should rank higher
 * - Cases where character sequence matters more than just presence
 *
 * Example scores:
 * - "cat" in "Category" → High score (word boundary match)
 * - "cat" in "Scatter" → Medium score (consecutive matches)
 * - "cat" in "C_a_t" → Lower score (separated matches)
 * - "cat" in "tac" → 0 (wrong order)
 */
export function computeMatchScore(query: string, target: string): number {
	// Return 0 if either string is empty
	if (!query || !target) return 0;

	// Track current position in both strings
	let queryIndex = 0;
	let targetIndex = 0;

	// Track the running score and match quality
	let matchScore = 0; // Total score accumulated
	let consecutiveMatches = 0; // Number of characters matched in a row
	let skippedCharCount = 0; // Number of non-matching characters we've passed

	// Keep scanning until we either:
	// 1. Find all query characters (success) or
	// 2. Run out of target characters (partial/no match)
	while (queryIndex < query.length && targetIndex < target.length) {
		// Use localeCompare with sensitivity: 'base' for case-insensitive comparison
		const isMatch =
			query[queryIndex].localeCompare(target[targetIndex], undefined, {
				sensitivity: 'base'
			}) === 0;

		if (isMatch) {
			// Determine match quality and assign appropriate score:
			// - Word boundary matches (after space or start)
			// - Consecutive matches
			// - Regular matches
			const isWordBoundary = targetIndex === 0 || target[targetIndex - 1] === ' ';
			const positionScore = isWordBoundary
				? WEIGHTS.WORD_BOUNDARY
				: consecutiveMatches > 0
					? WEIGHTS.CONSECUTIVE
					: WEIGHTS.BASE;

			matchScore += positionScore;
			consecutiveMatches++; // Increment consecutive match counter
			queryIndex++; // Move to next query character
		} else {
			// On non-match:
			consecutiveMatches = 0; // Reset consecutive match counter
			skippedCharCount++; // Track number of skipped characters
		}
		targetIndex++; // Always move forward in target string
	}

	// If we didn't find all query characters, return no match
	if (queryIndex < query.length) return 0;

	// Calculate final score:
	// 1. Calculate best possible score
	const maxPossibleScore = computeMaxPossibleScore(query, target);

	// 2. Normalize match score to 0-1 range
	const normalizedMatchScore = matchScore / maxPossibleScore;

	// 3. Calculate penalty for skipped characters
	// (skips are worse if they're a large portion of target length)
	const skipPenalty = (skippedCharCount / target.length) * WEIGHTS.SKIPPED;

	// 4. Return final score (clamped between 0 and 1)
	return Math.max(0, Math.min(1, normalizedMatchScore - skipPenalty));
}

function computeMaxPossibleScore(query: string, target: string): number {
	const targetWordBoundaries = computeWordBoundaries(target);

	// Calculate best possible score using available word boundaries
	return (
		Math.min(
			query.length, // Can't use more boundaries than query length
			targetWordBoundaries
		) *
			WEIGHTS.WORD_BOUNDARY +
		Math.max(0, query.length - targetWordBoundaries) * WEIGHTS.CONSECUTIVE
	);
}

const boundaryCache = new Map<string, number>();

function computeWordBoundaries(target: string): number {
	const cached = boundaryCache.get(target);
	if (cached) return cached;

	// Count word boundaries by counting spaces and adding 1 for the start
	const boundaries = 1 + (target.match(/\s+/g)?.length ?? 0);
	boundaryCache.set(target, boundaries);
	return boundaries;
}
