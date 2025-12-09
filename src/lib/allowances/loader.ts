import {
	MeasurementSystems,
	type AirlineInfo,
	type BagAllowance,
	type BagAllowanceDimensions,
	type Data,
	type TestResult,
	type Weight
} from '$lib/types';
import { allowances, type AirlineAllowance } from '$lib/allowances/cabin-luggage-allowances';
import allowanceConsistencyResults from '$lib/allowances/allowance-consistency-results.json' assert { type: 'json' };
import { convertDimensions, convertWeight } from '$lib/utils/math';

export function loadData(): Data {
	const parsedAllowances = allowances.map(mapAirlineData);
	return {
		meta: {
			lastTestRun: new Date(allowanceConsistencyResults.meta.lastTestRun),
			coveredByTest: parsedAllowances.filter((airline) => airline.testResult).length
		},
		allowances: parsedAllowances
	};
}

function mapAirlineData(allowance: AirlineAllowance): AirlineInfo {
	if (!allowance.carryOn.dimensions) {
		throw new Error(`No dimensions for ${allowance.airline}`);
	}

	const carryOnDimensions = getCarryOnDimensions(allowance.airline, allowance.carryOn.dimensions);

	const carryOnWeight = getWeight(allowance.carryOn.weight);

	const carryon: BagAllowance = {
		...carryOnDimensions,
		...(carryOnWeight && { weight: carryOnWeight })
	};

	let personalItem: BagAllowance | undefined;
	if (allowance.personalItem) {
		if (!allowance.personalItem.dimensions) {
			throw new Error(`No dimensions for personal item of ${allowance.airline}`);
		}
		const personalItemDimensions = getCarryOnDimensions(
			allowance.airline,
			allowance.personalItem.dimensions
		);
		const personalItemWeight = getWeight(allowance.personalItem.weight);

		personalItem = {
			...personalItemDimensions,
			...(personalItemWeight && { weight: personalItemWeight })
		};
	}

	const totalWeight = getWeight(allowance.totalWeight);

	const parsedTestResult = getLastTestOfAirline(
		allowanceConsistencyResults.results[
			allowance.id as keyof typeof allowanceConsistencyResults.results
		]
	);

	return {
		airline: allowance.airline,
		region: allowance.region,
		link: allowance.link,
		carryon,
		personalItem,
		...(totalWeight && { totalWeight }),
		testResult: parsedTestResult
	};
}

function getLastTestOfAirline(
	result?: TestResult
): { lastTest: Date; success: boolean } | undefined {
	if (!result?.lastTestPass && !result?.lastTestFail) {
		return undefined;
	}

	const lastTestPass = result?.lastTestPass ? new Date(result.lastTestPass) : undefined;
	const lastTestFail = result?.lastTestFail ? new Date(result.lastTestFail) : undefined;

	const lastTest = [lastTestPass, lastTestFail]
		.filter(Boolean)
		.sort((a, b) => b!.getTime() - a!.getTime())[0];
	return { lastTest: lastTest!, success: lastTest === lastTestPass };
}

function getCarryOnDimensions(
	airlineName: string,
	dims: {
		centimeters?: number | number[];
		inches?: number | number[];
	}
): BagAllowanceDimensions {
	let parsedCentimeters = dims.centimeters ? getDimensions(dims.centimeters) : undefined;
	let parsedInches = dims.inches ? getDimensions(dims.inches) : undefined;

	if (!parsedCentimeters && !parsedInches) {
		throw new Error(`No dimensions for ${airlineName}`);
	}
	if (!parsedInches) {
		parsedInches = convertDimensions(parsedCentimeters!, MeasurementSystems.Imperial);
	}

	if (!parsedCentimeters) {
		parsedCentimeters = convertDimensions(parsedInches!, MeasurementSystems.Metric);
	}

	return {
		centimeters: parsedCentimeters,
		inches: parsedInches
	};
}

function getDimensions(dimensions: number | number[]): number | number[] {
	if (typeof dimensions === 'number') {
		return dimensions;
	}
	return dimensions.sort((a, b) => b - a);
}

function getWeight(weight?: { kilograms?: number; pounds?: number }): Weight | undefined {
	if (!weight) {
		return undefined;
	}

	let kilograms = weight.kilograms;
	let pounds = weight.pounds;

	if (!kilograms && !pounds) {
		return undefined;
	}

	if (!kilograms && typeof pounds === 'number') {
		kilograms = convertWeight(pounds, MeasurementSystems.Metric);
	}

	if (!pounds && typeof kilograms === 'number') {
		pounds = convertWeight(kilograms, MeasurementSystems.Imperial);
	}

	return {
		...(kilograms !== undefined && { kilograms }),
		...(pounds !== undefined && { pounds })
	};
}
