function levenshteinDistance(str1: string, str2: string): number {
	const len1 = str1.length;
	const len2 = str2.length;
	const matrix: number[][] = [];

	for (let i = 0; i <= len1; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= len2; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= len1; i++) {
		for (let j = 1; j <= len2; j++) {
			const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1,
				matrix[i][j - 1] + 1,
				matrix[i - 1][j - 1] + cost
			);
		}
	}

	return matrix[len1][len2];
}

function normalize(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

function tokenize(text: string): string[] {
	return normalize(text)
		.split(/\s+/)
		.filter((token) => token.length > 0);
}

function computeTokenScore(queryToken: string, targetToken: string): number {
	if (queryToken === targetToken) {
		return 1.0;
	}

	if (targetToken.startsWith(queryToken)) {
		return 0.9;
	}

	const distance = levenshteinDistance(queryToken, targetToken);
	const maxDistance = Math.floor(queryToken.length / 3);

	if (distance <= Math.max(1, maxDistance)) {
		const penalty = distance / queryToken.length;
		return Math.max(0, 0.7 - penalty);
	}

	return 0;
}

function matchTokens(queryTokens: string[], targetTokens: string[]): number {
	if (queryTokens.length === 0) return 0;

	const scores: number[] = [];

	for (const queryToken of queryTokens) {
		let bestScore = 0;

		for (const targetToken of targetTokens) {
			const score = computeTokenScore(queryToken, targetToken);
			bestScore = Math.max(bestScore, score);
		}

		scores.push(bestScore);
	}

	// TODO: max score should be also ok, need to test it
	const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
	return averageScore;
}

export interface SearchResult<T> {
	item: T;
	score: number;
}

export type SearchOptions<T> = T extends string
	? {
			threshold?: number;
			shouldSort?: boolean;
		}
	: {
			threshold?: number;
			shouldSort?: boolean;
			key?: keyof T & string;
		};

const DEFAULT_OPTIONS = {
	threshold: 0.4,
	shouldSort: false
};

export function searchAirlines<T extends string | object>(
	query: string,
	items: T[],
	options?: SearchOptions<T>
): SearchResult<T>[] {
	const opts = { ...DEFAULT_OPTIONS, ...options };

	if (!query || query.trim() === '') {
		return items.map((item) => ({
			item: item,
			score: 1
		}));
	}

	const queryTokens = tokenize(query);

	const getSearchableText = (item: T): string => {
		if (typeof item === 'string') {
			return item;
		}

		const key = (opts as { key?: string }).key;
		if (key) {
			return (item as Record<string, unknown>)[key] as string;
		}

		return String(item);
	};

	const scoredResults = items
		.map((item) => {
			const targetTokens = tokenize(getSearchableText(item));
			const score = matchTokens(queryTokens, targetTokens);
			return { item, score };
		})
		.filter((result) => result.score >= opts.threshold!);

	if (opts.shouldSort) {
		return scoredResults.sort((a, b) => b.score - a.score);
	}

	return scoredResults;
}
