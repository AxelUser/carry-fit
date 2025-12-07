import {
	MeasurementSystems,
	type AirlineInfo,
	type BagAllowanceDimensions,
	type Data,
	type TestResult
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
	const carryOnDimensions = getCarryOnDimensions(allowance.airline, allowance.carryOn);

	let personalItem: BagAllowanceDimensions | undefined;
	if (allowance.personalItem) {
		personalItem = getCarryOnDimensions(allowance.airline, allowance.personalItem);
	}

	let pounds = allowance.pounds ?? undefined;
	let kilograms = allowance.kilograms ?? undefined;

	if (!kilograms && typeof pounds === 'number') {
		kilograms = convertWeight(pounds, MeasurementSystems.Metric);
	}

	if (!pounds && typeof kilograms === 'number') {
		pounds = convertWeight(kilograms, MeasurementSystems.Imperial);
	}

	const parsedTestResult = getLastTestOfAirline(
		allowanceConsistencyResults.results[
			allowance.id as keyof typeof allowanceConsistencyResults.results
		]
	);

	return {
		airline: allowance.airline,
		region: allowance.region,
		link: allowance.link,
		carryon: carryOnDimensions,
		personalItem,
		pounds,
		kilograms,
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
