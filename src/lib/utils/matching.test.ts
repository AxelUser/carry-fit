import { describe, it, expect } from 'vitest';
import { searchAirlines } from './matching';

describe('searchAirlines', () => {
	describe('with object arrays', () => {
		const mockAirlines = [
			{ id: '1', airline: 'Lufthansa' },
			{ id: '2', airline: 'Air France' },
			{ id: '3', airline: 'British Airways' },
			{ id: '4', airline: 'Ryanair' },
			{ id: '5', airline: 'Aeroméxico' },
			{ id: '6', airline: 'American Airlines' },
			{ id: '7', airline: 'Delta Air Lines' },
			{ id: '8', airline: 'easyJet' }
		];

		it('should return all airlines when query is empty', () => {
			const results = searchAirlines('', mockAirlines, { key: 'airline' });
			expect(results.length).toBe(mockAirlines.length);
			expect(results.map((r) => r.item)).toEqual(mockAirlines);
		});

		it('should handle typos correctly', () => {
			const results = searchAirlines('Lufhansa', mockAirlines, { key: 'airline' });
			expect(results.length).toBeGreaterThan(0);
			expect(results[0].item.airline).toBe('Lufthansa');
		});

		it('should handle accent insensitivity', () => {
			const results = searchAirlines('Aeromexico', mockAirlines, { key: 'airline' });
			expect(results.length).toBeGreaterThan(0);
			expect(results[0].item.airline).toBe('Aeroméxico');
		});

		it('should handle prefix matching', () => {
			const results = searchAirlines('Air', mockAirlines, { key: 'airline' });
			expect(results.length).toBeGreaterThan(0);
			const airlineNames = results.map((r) => r.item.airline);
			expect(airlineNames).toContain('Air France');
		});

		it('should handle partial word matching', () => {
			const results = searchAirlines('Brit', mockAirlines, { key: 'airline' });
			expect(results.length).toBeGreaterThan(0);
			expect(results[0].item.airline).toBe('British Airways');
		});

		it('should handle multi-word queries', () => {
			const results = searchAirlines('Air France', mockAirlines, { key: 'airline' });
			expect(results.length).toBeGreaterThan(0);
			expect(results[0].item.airline).toBe('Air France');
		});

		it('should return empty array for non-matching query', () => {
			const results = searchAirlines('xyz123', mockAirlines, { key: 'airline' });
			expect(results).toEqual([]);
		});

		it('should rank exact matches higher than partial matches', () => {
			const results = searchAirlines('Air', mockAirlines, { key: 'airline' });
			const exactMatch = results.find((r) => r.item.airline === 'Air France');
			expect(results.indexOf(exactMatch!)).toBeLessThan(3);
		});

		it('should handle case insensitivity', () => {
			const results = searchAirlines('RYANAIR', mockAirlines, { key: 'airline' });
			expect(results.length).toBeGreaterThan(0);
			expect(results[0].item.airline).toBe('Ryanair');
		});

		it('should work with custom key field', () => {
			const mockData = [
				{ id: '1', name: 'Lufthansa', code: 'LH' },
				{ id: '2', name: 'Air France', code: 'AF' },
				{ id: '3', name: 'Ryanair', code: 'FR' }
			];

			const results = searchAirlines('Lufhansa', mockData, { key: 'name' });
			expect(results.length).toBeGreaterThan(0);
			expect(results[0].item.name).toBe('Lufthansa');
		});

		it('should return single result for exact match', () => {
			const results = searchAirlines('Air France', mockAirlines, { key: 'airline' });
			expect(results.length).toBe(1);
			expect(results[0].item.airline).toBe('Air France');
			expect(results[0].score).toBe(1);
		});
	});

	describe('with string arrays', () => {
		const mockAirlines = [
			'Lufthansa',
			'Air France',
			'British Airways',
			'Ryanair',
			'Aeroméxico',
			'American Airlines',
			'Delta Air Lines',
			'easyJet'
		];

		it('should return all airlines when query is empty', () => {
			const results = searchAirlines('', mockAirlines);
			expect(results.length).toBe(mockAirlines.length);
			expect(results.map((r) => r.item)).toEqual(mockAirlines);
		});

		it('should handle typos correctly with strings', () => {
			const results = searchAirlines('Lufhansa', mockAirlines);
			expect(results.length).toBeGreaterThan(0);
			expect(results[0].item).toBe('Lufthansa');
		});

		it('should handle accent insensitivity with strings', () => {
			const results = searchAirlines('Aeromexico', mockAirlines);
			expect(results.length).toBeGreaterThan(0);
			expect(results[0].item).toBe('Aeroméxico');
		});

		it('should handle prefix matching with strings', () => {
			const results = searchAirlines('Air', mockAirlines);
			expect(results.length).toBeGreaterThan(0);
			const airlineNames = results.map((r) => r.item);
			expect(airlineNames).toContain('Air France');
		});

		it('should return empty array for non-matching query with strings', () => {
			const results = searchAirlines('xyz123', mockAirlines);
			expect(results).toEqual([]);
		});

		it('should include score in results', () => {
			const results = searchAirlines('Lufthansa', mockAirlines);
			expect(results.length).toBeGreaterThan(0);
			expect(results[0].score).toBeGreaterThan(0);
			expect(results[0].score).toBeLessThanOrEqual(1);
		});
	});
});
