import { type UserDimensions, type MeasurementSystem, MeasurementSystems } from '$lib/types';

export function convertDimensions<T extends UserDimensions | number | number[]>(
	dimensions: T,
	to: MeasurementSystem
): T {
	const factor = to === MeasurementSystems.Metric ? 2.54 : 1 / 2.54;

	if (typeof dimensions === 'number') {
		return (Math.round(dimensions * factor * 10) / 10) as T;
	}

	if (Array.isArray(dimensions)) {
		return dimensions.map((value) => Math.round(value * factor * 10) / 10) as T;
	}

	return {
		depth: Math.round(dimensions.depth * factor * 10) / 10,
		width: Math.round(dimensions.width * factor * 10) / 10,
		height: Math.round(dimensions.height * factor * 10) / 10
	} as T;
}

export function convertWeight(value: number, to: MeasurementSystem): number {
	const factor = to === MeasurementSystems.Metric ? 1 / 2.205 : 2.205;

	return Math.round(value * factor);
}
