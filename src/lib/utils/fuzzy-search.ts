export function fuzzySearch(searchTerm: string, text: string): boolean {
	// n tracks our position in the search term
	let n = 0;
	// l tracks our position in the text we're searching through
	let l = 0;

	// Continue until we've searched through all the text
	while (l < text.length) {
		// Compare current characters, ignoring case
		if (text[l].localeCompare(searchTerm[n], undefined, { sensitivity: 'base' }) === 0) {
			// If characters match, move to next character in search term
			n++;
		}

		// If we've matched all characters in the search term, we've found a match
		if (n === searchTerm.length) {
			return true;
		}
		// Move to next character in text regardless of match
		l++;
	}

	// If we've searched all text without finding all characters, return false
	return false;
}
