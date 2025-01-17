import { describe, it, expect } from 'vitest';
import { convertDimensions, convertWeight } from './math';
import { MeasurementSystems, type UserDimensions } from '$lib/types';

describe('convertDimensions', () => {
	it('converts a single number from inches to centimeters', () => {
		const inches = 10;
		const result = convertDimensions(inches, MeasurementSystems.Metric);
		expect(result).toBe(25.4);
	});

	it('converts a single number from centimeters to inches', () => {
		const centimeters = 25.4;
		const result = convertDimensions(centimeters, MeasurementSystems.Imperial);
		expect(result).toBe(10);
	});

	it('converts an array of numbers from inches to centimeters', () => {
		const inches = [10, 20, 30];
		const result = convertDimensions(inches, MeasurementSystems.Metric);
		expect(result).toEqual([25.4, 50.8, 76.2]);
	});

	it('converts an array of numbers from centimeters to inches', () => {
		const centimeters = [25.4, 50.8, 76.2];
		const result = convertDimensions(centimeters, MeasurementSystems.Imperial);
		expect(result).toEqual([10, 20, 30]);
	});

	it('converts UserDimensions from inches to centimeters', () => {
		const dimensions: UserDimensions = {
			width: 10,
			height: 20,
			depth: 30
		};
		const result = convertDimensions(dimensions, MeasurementSystems.Metric);
		expect(result).toEqual({
			width: 25.4,
			height: 50.8,
			depth: 76.2
		});
	});

	it('converts UserDimensions from centimeters to inches', () => {
		const dimensions: UserDimensions = {
			width: 25.4,
			height: 50.8,
			depth: 76.2
		};
		const result = convertDimensions(dimensions, MeasurementSystems.Imperial);
		expect(result).toEqual({
			width: 10,
			height: 20,
			depth: 30
		});
	});

	it('rounds results to one decimal place', () => {
		const inches = 10.666666;
		const result = convertDimensions(inches, MeasurementSystems.Metric);
		expect(result).toBe(27.1); // 10.666666 * 2.54 ≈ 27.09333... → 27.1
	});
});

describe('convertWeight', () => {
	it('converts weight from pounds to kilograms', () => {
		const pounds = 100;
		const result = convertWeight(pounds, MeasurementSystems.Metric);
		expect(result).toBe(45); // 100 / 2.205 ≈ 45.35... → 45
	});

	it('converts weight from kilograms to pounds', () => {
		const kilograms = 45;
		const result = convertWeight(kilograms, MeasurementSystems.Imperial);
		expect(result).toBe(99); // 45 * 2.205 ≈ 99.225... → 99
	});

	it('rounds results to whole numbers', () => {
		const pounds = 10.5;
		const result = convertWeight(pounds, MeasurementSystems.Metric);
		expect(Number.isInteger(result)).toBe(true);
	});
});
