import { describe, it, expect } from 'vitest';
import { computeMatchScore } from './matching';

describe('computeMatchScore', () => {
	it('should return 1 for exact string matches', () => {
		const testCases = [
			['cat', 'cat'],
			['hello', 'hello'],
			['TEST', 'test'], // Case insensitive
			['Mixed', 'MIXED'] // Case insensitive
		];

		testCases.forEach(([query, target]) => {
			const score = computeMatchScore(query, target);
			expect(
				score,
				`Expected score of 1 for exact match: query="${query}", target="${target}", got ${score}`
			).toBe(1);
		});
	});

	// Additional test cases for different scenarios
	it('should handle word boundary matches', () => {
		expect(computeMatchScore('cat', 'category')).toBeGreaterThan(0.5);
		expect(computeMatchScore('cat', 'scatter')).toBeLessThan(computeMatchScore('cat', 'category'));
	});

	it('should return 0 for non-matches', () => {
		expect(computeMatchScore('cat', 'dog')).toBe(0);
		expect(computeMatchScore('abc', 'cba')).toBe(0);
	});

	it('should handle empty inputs', () => {
		expect(computeMatchScore('', 'test')).toBe(0);
		expect(computeMatchScore('test', '')).toBe(0);
		expect(computeMatchScore('', '')).toBe(0);
	});
});
