import {
	type BagAllowanceDimensions,
	type UserDimensions,
	type MeasurementSystem,
	MeasurementSystems,
	type DimensionValue,
	type SortedDimensions
} from '$lib/types';

export const descDimensions = (dims: [number, number, number]): SortedDimensions =>
	dims.toSorted((a, b) => b - a) as SortedDimensions;

export function getRelevantAirlineDimensions(
	allowanceDims: Partial<BagAllowanceDimensions>,
	measurementSystem: MeasurementSystem
): DimensionValue | undefined {
	const dims =
		measurementSystem === MeasurementSystems.Metric
			? allowanceDims.centimeters
			: allowanceDims.inches;
	if (dims === undefined) {
		return undefined;
	}
	return dims;
}

export function getUserDimensionsIfFilled(bagDimensions: UserDimensions): number[] {
	if (bagDimensions.depth && bagDimensions.width && bagDimensions.height) {
		return [bagDimensions.depth, bagDimensions.width, bagDimensions.height];
	}
	return [];
}
