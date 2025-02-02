import { describe, it, expect } from 'vitest';
import { fuzzySearch } from './fuzzy-search';

describe('fuzzySearch', () => {
	// Test exact matches
	it('should match exact strings', () => {
		expect(fuzzySearch('Finnair', 'Finnair')).toBe(true);
		expect(fuzzySearch('Air France', 'Air France')).toBe(true);
	});

	// Test case insensitivity
	it('should be case insensitive', () => {
		expect(fuzzySearch('LUFTHANSA', 'Lufthansa')).toBe(true);
		expect(fuzzySearch('thai airways', 'Thai Airways')).toBe(true);
		expect(fuzzySearch('AirCanada', 'aircanada')).toBe(true);
	});

	// Test substring matches
	it('should match substrings in sequence', () => {
		expect(fuzzySearch('Singa', 'Singapore Airlines')).toBe(true);
		expect(fuzzySearch('BritAir', 'British Airways')).toBe(true);
		expect(fuzzySearch('QtrAir', 'Qatar Airways')).toBe(true);
	});

	// Test non-matches
	it('should return false for non-matches', () => {
		expect(fuzzySearch('Delta', 'United Airlines')).toBe(false);
		expect(fuzzySearch('American', 'Emirates')).toBe(false);
	});

	// Test empty strings
	it('should handle empty strings', () => {
		expect(fuzzySearch('', 'Lufthansa')).toBe(false);
		expect(fuzzySearch('Emirates', '')).toBe(false);
		expect(fuzzySearch('', '')).toBe(true);
	});

	// Test Levenshtein distance matches
	it('should match similar words using Levenshtein distance', () => {
		// Test with default threshold (0.7)
		expect(fuzzySearch('Emiretes', 'Emirates')).toBe(true); // Transposition
		expect(fuzzySearch('Lufthansa', 'Lufthnsa')).toBe(true); // Deletion
		expect(fuzzySearch('Qatar', 'Quatar')).toBe(true); // Insertion
		expect(fuzzySearch('Finnair', 'Finnear')).toBe(true); // Substitution
	});

	// Test with different thresholds
	it('should respect custom similarity thresholds', () => {
		// Very strict threshold (0.9)
		expect(fuzzySearch('Lufthansa', 'Lufthnsa', 0.9)).toBe(false);
		expect(fuzzySearch('Emirates', 'Emirates', 0.9)).toBe(true);

		// Very lenient threshold (0.5)
		expect(fuzzySearch('Ryanair', 'Rynar', 0.5)).toBe(true);
		expect(fuzzySearch('EasyJet', 'EsyJt', 0.5)).toBe(true);
	});

	// Test multi-word searches
	it('should handle multi-word searches', () => {
		expect(fuzzySearch('Air France', 'Air France')).toBe(true);
		expect(fuzzySearch('British Airways', 'Britsh Airwys')).toBe(true);
		expect(fuzzySearch('Qatar Airways', 'Quatar Airways')).toBe(true);
		expect(fuzzySearch('Thai Airways', 'Thai Express')).toBe(false);
	});

	// Test with special characters
	it('should handle special characters', () => {
		expect(fuzzySearch('Aeroméxico', 'Aeromexico')).toBe(true);
		expect(fuzzySearch('Scandinavian Björk', 'Scandinavian Bjork')).toBe(true);
		expect(fuzzySearch('Zürich Air', 'Zurich Air')).toBe(true);
	});

	// Test with whitespace variations
	it('should handle whitespace variations', () => {
		expect(fuzzySearch('Air  France', 'Air France')).toBe(true);
		expect(fuzzySearch('British Airways', 'British    Airways')).toBe(true);
		expect(fuzzySearch('Qatar\tAirways', 'Qatar Airways')).toBe(true);
		expect(fuzzySearch('Thai\nAirways', 'Thai Airways')).toBe(true);
	});

	// Test word boundaries
	it('should respect word boundaries in multi-word searches', () => {
		expect(fuzzySearch('Air France', 'Air France International')).toBe(true);
		expect(fuzzySearch('Thai Air', 'Thai Airways')).toBe(true);
		expect(fuzzySearch('British Air', 'British Airways International')).toBe(true);
	});

	it('should handle longer strings efficiently', () => {
		const longText =
			'Welcome aboard Emirates Airlines, your gateway to Dubai and beyond. We offer flights to over 150 destinations worldwide with award-winning service and hospitality.';
		expect(fuzzySearch('emirates airlines', longText)).toBe(true);
		expect(fuzzySearch('dubai gateway', longText)).toBe(true);
		expect(fuzzySearch('award winning', longText)).toBe(true);
		expect(fuzzySearch('british airways', longText)).toBe(false);
	});
});
