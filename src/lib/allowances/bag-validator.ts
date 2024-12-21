/**
 * Check if the user's bag dimensions comply with the airline's carry-on limits.
 * @param airline - The airline object containing the carry-on limits. Can be size per dimension or total size.
 * @param userDimensions - The user's bag dimensions.
 * @returns An object containing the compliance status for each dimension, or a boolean if the airline has a total size limit. If user dimensions contain 0, returns null.
 */
export function checkCompliance(
	airlineDimensions: number[],
	userDimensions: number[]
): boolean[] | null {
	if (airlineDimensions.length === 0 || userDimensions.length === 0) return null;

	if (airlineDimensions.length === 1) {
		const bagSum = userDimensions.reduce((acc, curr) => acc + curr, 0);
		return [bagSum <= airlineDimensions[0]];
	}

	const bagDims = userDimensions.sort((a, b) => b - a);

	return airlineDimensions.map((dim, index) => bagDims[index] <= dim);
}
