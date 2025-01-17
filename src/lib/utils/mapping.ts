import {
	type BagAllowanceDimensions,
	type UserDimensions,
	type MeasurementSystem,
	MeasurementSystems
} from '$lib/types';

export function getAirlineDimensions(
	allowanceDims: BagAllowanceDimensions,
	measurementSystem: MeasurementSystem
): number[] {
	const dims =
		measurementSystem === MeasurementSystems.Metric
			? allowanceDims.centimeters
			: allowanceDims.inches;
	return Array.isArray(dims) ? dims : [dims];
}

export function getUserDimensionsIfFilled(bagDimensions: UserDimensions): number[] {
	if (bagDimensions.depth && bagDimensions.width && bagDimensions.height) {
		return [bagDimensions.depth, bagDimensions.width, bagDimensions.height];
	}
	return [];
}
