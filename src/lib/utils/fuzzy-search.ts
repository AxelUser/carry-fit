/**
 * Calculates the Levenshtein distance between two strings.
 * The Levenshtein distance is the minimum number of single-character edits
 * (insertions, deletions, or substitutions) required to change one string into another.
 *
 * @param str1 First string to compare
 * @param str2 Second string to compare
 * @returns The minimum number of operations needed to transform str1 into str2
 */
function levenshteinDistance(str1: string, str2: string): number {
	const m = str1.length;
	const n = str2.length;
	// Create a matrix of size (m+1)x(n+1) initialized with zeros
	// Where m and n are lengths of the input strings
	const dp: number[][] = Array(m + 1)
		.fill(null)
		.map(() => Array(n + 1).fill(0));

	// Initialize first row and column
	// These represent the distance from an empty string to str1/str2
	for (let i = 0; i <= m; i++) dp[i][0] = i; // Cost of deleting characters from str1
	for (let j = 0; j <= n; j++) dp[0][j] = j; // Cost of inserting characters from str2

	// Fill the rest of the matrix
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			// If characters match (case-insensitive), no operation needed
			// Use the previous minimum distance
			if (str1[i - 1].localeCompare(str2[j - 1], undefined, { sensitivity: 'base' }) === 0) {
				dp[i][j] = dp[i - 1][j - 1];
			} else {
				// If characters don't match, take the minimum of:
				dp[i][j] =
					Math.min(
						dp[i - 1][j - 1], // Substitution: replace str1[i-1] with str2[j-1]
						dp[i - 1][j], // Deletion: remove character from str1
						dp[i][j - 1] // Insertion: add character from str2
					) + 1; // Add 1 for the operation cost
			}
		}
	}

	// The bottom-right cell contains the minimum distance between the full strings
	return dp[m][n];
}

/**
 * Performs fuzzy search using both character matching and Levenshtein distance
 */
export function fuzzySearch(searchTerm: string, text: string, threshold = 0.7): boolean {
	if (searchTerm.length === 0 && text.length === 0) return true;
	if (searchTerm.length === 0) return false;
	if (text.length === 0) return false;

	// Use linear O(n) character matching for quick matches
	let n = 0;
	let l = 0;
	while (l < text.length) {
		if (text[l].localeCompare(searchTerm[n], undefined, { sensitivity: 'base' }) === 0) {
			n++;
		}
		if (n === searchTerm.length) {
			return true;
		}
		l++;
	}

	// If no match found, use Levenshtein distance for fuzzy matching
	const words = text.split(/\s+/);
	const searchWords = searchTerm.split(/\s+/);

	for (const searchWord of searchWords) {
		let foundMatch = false;
		for (const word of words) {
			// Calculate normalized distance (0-1 scale)
			const maxLength = Math.max(searchWord.length, word.length);
			const distance = levenshteinDistance(searchWord, word);
			const similarity = 1 - distance / maxLength;

			// Consider it a match if similarity is above threshold
			if (similarity > threshold) {
				foundMatch = true;
				break;
			}
		}
		if (!foundMatch) return false;
	}

	return true;
}
